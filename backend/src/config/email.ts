import sgMail from '@sendgrid/mail';
import { logger } from './logger';

// Initialize SendGrid
const initializeSendGrid = () => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      logger.warn('SendGrid API key not configured - email notifications will be disabled');
      return;
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    logger.info('SendGrid configured successfully');
  } catch (error) {
    logger.error('Failed to configure SendGrid:', error);
    throw error;
  }
};

// Initialize SendGrid
initializeSendGrid();

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      logger.warn('Email not sent - SendGrid not configured');
      return;
    }

    const msg: any = {
      to: options.to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@sahijagah.com',
        name: process.env.SENDGRID_FROM_NAME || 'Sahi Jagah',
      },
      subject: options.subject,
    };

    if (options.templateId) {
      msg.templateId = options.templateId;
      msg.dynamicTemplateData = options.dynamicTemplateData;
    } else {
      msg.text = options.text;
      msg.html = options.html;
    }

    await sgMail.send(msg);
    logger.info(`Email sent successfully to ${options.to}`);
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw error;
  }
};

// Email templates
export const sendWelcomeEmail = async (to: string, name: string) => {
  await sendEmail({
    to,
    subject: 'Welcome to Sahi Jagah!',
    html: `
      <h1>Welcome to Sahi Jagah, ${name}!</h1>
      <p>Thank you for joining our property marketplace.</p>
      <p>Start exploring properties in tier-2 and tier-3 cities across India.</p>
      <p>Best regards,<br>The Sahi Jagah Team</p>
    `,
  });
};

export const sendOTPEmail = async (to: string, otp: string) => {
  await sendEmail({
    to,
    subject: 'Your OTP for Sahi Jagah',
    html: `
      <h2>Your OTP Code</h2>
      <p>Your one-time password is: <strong>${otp}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    `,
  });
};

export const sendBookingConfirmationEmail = async (
  to: string,
  bookingDetails: any
) => {
  await sendEmail({
    to,
    subject: 'Booking Confirmed - Sahi Jagah',
    html: `
      <h2>Your booking has been confirmed!</h2>
      <p><strong>Property:</strong> ${bookingDetails.propertyTitle}</p>
      <p><strong>Date & Time:</strong> ${bookingDetails.scheduledAt}</p>
      <p><strong>Location:</strong> ${bookingDetails.address}</p>
      <p>We look forward to seeing you!</p>
    `,
  });
};

export const sendVerificationStatusEmail = async (
  to: string,
  propertyTitle: string,
  status: 'approved' | 'rejected',
  reason?: string
) => {
  const subject = status === 'approved' 
    ? 'Property Verified - Sahi Jagah'
    : 'Property Verification Update - Sahi Jagah';

  const html = status === 'approved'
    ? `
      <h2>Your property has been verified!</h2>
      <p><strong>Property:</strong> ${propertyTitle}</p>
      <p>Your property is now live and visible to potential clients.</p>
    `
    : `
      <h2>Property Verification Update</h2>
      <p><strong>Property:</strong> ${propertyTitle}</p>
      <p>Unfortunately, your property verification was not approved.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>Please update your property details and resubmit for verification.</p>
    `;

  await sendEmail({ to, subject, html });
};

export const sendLeaseSignedEmail = async (
  to: string,
  leaseDetails: any,
  pdfUrl: string
) => {
  await sendEmail({
    to,
    subject: 'Lease Agreement Signed - Sahi Jagah',
    html: `
      <h2>Lease Agreement Completed</h2>
      <p>The lease agreement for <strong>${leaseDetails.propertyTitle}</strong> has been signed by both parties.</p>
      <p><a href="${pdfUrl}">Download Signed Lease Agreement</a></p>
      <p>Please keep this document for your records.</p>
    `,
  });
};

export default sgMail;
