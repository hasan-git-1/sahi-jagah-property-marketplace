import twilio from 'twilio';
import { logger } from './logger';

let twilioClient: ReturnType<typeof twilio> | null = null;

// Initialize Twilio
const initializeTwilio = () => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      logger.warn('Twilio credentials not configured - SMS notifications will be disabled');
      return;
    }

    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    logger.info('Twilio configured successfully');
  } catch (error) {
    logger.error('Failed to configure Twilio:', error);
    throw error;
  }
};

// Initialize Twilio
initializeTwilio();

export const sendSMS = async (to: string, message: string) => {
  try {
    if (!twilioClient) {
      logger.warn('SMS not sent - Twilio not configured');
      return;
    }

    // Ensure phone number is in E.164 format (+91XXXXXXXXXX for India)
    const formattedPhone = to.startsWith('+') ? to : `+91${to}`;

    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    logger.info(`SMS sent successfully to ${to}, SID: ${result.sid}`);
    return result;
  } catch (error) {
    logger.error('Failed to send SMS:', error);
    throw error;
  }
};

export const sendOTPSMS = async (to: string, otp: string) => {
  const message = `Your Sahi Jagah OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`;
  return sendSMS(to, message);
};

export const sendBookingNotificationSMS = async (
  to: string,
  propertyTitle: string,
  scheduledAt: string
) => {
  const message = `Booking confirmed for ${propertyTitle} on ${scheduledAt}. - Sahi Jagah`;
  return sendSMS(to, message);
};

export const sendVerificationNotificationSMS = async (
  to: string,
  propertyTitle: string,
  status: 'approved' | 'rejected'
) => {
  const message = status === 'approved'
    ? `Your property "${propertyTitle}" has been verified and is now live! - Sahi Jagah`
    : `Your property "${propertyTitle}" verification needs attention. Check your email for details. - Sahi Jagah`;
  return sendSMS(to, message);
};

export default twilioClient;
