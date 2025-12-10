/**
 * Document Model
 * 
 * Represents property verification documents
 */

export type DocumentType = 'ownership' | 'identity' | 'tax' | 'noc' | 'other';
export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface Document {
  id: string;
  propertyId: string;
  ownerId: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: DocumentStatus;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  uploadedAt: Date;
  expiresAt: Date; // For compatibility (Cloudinary URLs don't expire)
  cloudinaryPublicId?: string; // Cloudinary public ID for deletion
}

export interface DocumentUploadRequest {
  propertyId: string;
  type: DocumentType;
  file: Express.Multer.File;
}

export interface DocumentVerificationRequest {
  documentId: string;
  status: 'approved' | 'rejected';
  reason?: string;
}
