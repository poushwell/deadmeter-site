/**
 * lib/resend.ts
 *
 * Resend singleton for transactional email.
 * TZ_04 §9.2
 */

import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);