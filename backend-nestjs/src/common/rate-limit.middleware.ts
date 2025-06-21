import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';

dotenv.config();
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '1') * 60 * 1000, // minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '1'), // limit each IP requests per windowMs
  message: {
    statusCode: 429,
    error: 'Too Many Requests',
    message: 
    `You have exceeded the ${parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '1')} requests in ${parseInt(process.env.RATE_LIMIT_MAX || '1')} minutes limit!`,
  },
});