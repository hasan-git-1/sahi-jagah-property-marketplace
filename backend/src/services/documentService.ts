/**
 * Document Service
 * 
 * Handles document upload, storage, and verification
 * Uses Cloudinary for document storage
 */

import { db } from '../config/firebase.js';
import cloudinary, { deleteAsset } from '../config/cloudinary.js';
import { Document, DocumentType, DocumentStatus } from '../models/document.js';
import { logger } from '../config/logger.js';

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export class DocumentService {
  /**
   * Upload document to Cloudinary
   */
  async uploadDocument(
    propertyId: string,
    ownerId: string,
    type: DocumentType,
    file: Express.Multer.File
  ): Promise<Document> {
    try {
      // Validate file
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        throw new Error('Invalid file type. Only PDF, JPG, and PNG are allowed.');
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds 10MB limit.');
      }

      // Determine resource type for Cloudinary
      const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
      
      // Upload to Cloudinary
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `documents/${propertyId}`,
              resource_type: resourceType,
              public_id: `${type}_${Date.now()}`,
              context: {
                propertyId,
                ownerId,
                type,
              },
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(file.buffer);
      });

      // Create document record
      const timestamp = Date.now();
      const document: Document = {
        id: `doc_${timestamp}`,
        propertyId,
        ownerId,
        type,
        fileName: file.originalname,
        fileUrl: uploadResult.secure_url,
        fileSize: file.size,
        mimeType: file.mimetype,
        status: 'pending',
        uploadedAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year (Cloudinary URLs don't expire)
        cloudinaryPublicId: uploadResult.public_id, // Store for deletion
      };

      // Save to Firestore
      await db.collection('documents').doc(document.id).set(document);

      // Update property verification status
      await db.collection('properties').doc(propertyId).update({
        verificationStatus: 'pending',
        updatedAt: new Date(),
      });

      logger.info(`Document uploaded to Cloudinary: ${document.id} for property ${propertyId}`);

      return document;
    } catch (error) {
      logger.error('Error uploading document:', error);
      throw error;
    }
  }

  /**
   * Get document by ID (Cloudinary URLs don't expire)
   */
  async getDocument(documentId: string): Promise<Document> {
    try {
      const docRef = await db.collection('documents').doc(documentId).get();

      if (!docRef.exists) {
        throw new Error('Document not found');
      }

      const document = docRef.data() as Document;

      // Cloudinary URLs are permanent, no need to regenerate
      return document;
    } catch (error) {
      logger.error('Error getting document:', error);
      throw error;
    }
  }

  /**
   * Get all documents for a property
   */
  async getPropertyDocuments(propertyId: string): Promise<Document[]> {
    try {
      const snapshot = await db
        .collection('documents')
        .where('propertyId', '==', propertyId)
        .orderBy('uploadedAt', 'desc')
        .get();

      return snapshot.docs.map(doc => doc.data() as Document);
    } catch (error) {
      logger.error('Error getting property documents:', error);
      throw error;
    }
  }

  /**
   * Delete document from Cloudinary and Firestore
   */
  async deleteDocument(documentId: string, userId: string): Promise<void> {
    try {
      const docRef = await db.collection('documents').doc(documentId).get();

      if (!docRef.exists) {
        throw new Error('Document not found');
      }

      const document = docRef.data() as Document;

      // Check ownership
      if (document.ownerId !== userId) {
        throw new Error('Unauthorized to delete this document');
      }

      // Delete from Cloudinary
      if (document.cloudinaryPublicId) {
        const resourceType = document.mimeType === 'application/pdf' ? 'raw' : 'image';
        await deleteAsset(document.cloudinaryPublicId, resourceType as any);
      }

      // Delete from Firestore
      await db.collection('documents').doc(documentId).delete();

      logger.info(`Document deleted from Cloudinary and Firestore: ${documentId}`);
    } catch (error) {
      logger.error('Error deleting document:', error);
      throw error;
    }
  }

  /**
   * Get pending documents for admin verification
   */
  async getPendingDocuments(): Promise<Document[]> {
    try {
      const snapshot = await db
        .collection('documents')
        .where('status', '==', 'pending')
        .orderBy('uploadedAt', 'asc')
        .get();

      return snapshot.docs.map(doc => doc.data() as Document);
    } catch (error) {
      logger.error('Error getting pending documents:', error);
      throw error;
    }
  }

  /**
   * Verify document (admin only)
   */
  async verifyDocument(
    documentId: string,
    adminId: string,
    status: 'approved' | 'rejected',
    reason?: string
  ): Promise<Document> {
    try {
      const docRef = await db.collection('documents').doc(documentId).get();

      if (!docRef.exists) {
        throw new Error('Document not found');
      }

      const document = docRef.data() as Document;

      // Update document status
      const updates: Partial<Document> = {
        status,
        verifiedBy: adminId,
        verifiedAt: new Date(),
      };

      if (status === 'rejected' && reason) {
        updates.rejectionReason = reason;
      }

      await db.collection('documents').doc(documentId).update(updates);

      // Check if all documents for property are approved
      const propertyDocs = await this.getPropertyDocuments(document.propertyId);
      const allApproved = propertyDocs.every(doc => 
        doc.id === documentId ? status === 'approved' : doc.status === 'approved'
      );

      // Update property verification status
      if (allApproved) {
        await db.collection('properties').doc(document.propertyId).update({
          isVerified: true,
          verificationStatus: 'approved',
          updatedAt: new Date(),
        });
      } else if (status === 'rejected') {
        await db.collection('properties').doc(document.propertyId).update({
          verificationStatus: 'rejected',
          updatedAt: new Date(),
        });
      }

      // Create audit log
      await db.collection('auditLogs').add({
        action: 'document_verification',
        userId: adminId,
        documentId,
        propertyId: document.propertyId,
        status,
        reason,
        timestamp: new Date(),
      });

      logger.info(`Document ${status}: ${documentId} by admin ${adminId}`);

      return { ...document, ...updates } as Document;
    } catch (error) {
      logger.error('Error verifying document:', error);
      throw error;
    }
  }
}

export const documentService = new DocumentService();
