import Resend from '@auth/core/providers/resend';
import { Resend as ResendAPI } from 'resend';
import { RandomReader, generateRandomString } from '@oslojs/crypto/random';

export const ResendOTPPasswordReset = Resend({
  id: 'resend-otp-password-reset',
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    const random: RandomReader = { read: (b) => crypto.getRandomValues(b) };
    return generateRandomString(random, '0123456789', 8);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: 'Ad-pilot <onboarding@resend.dev>',
      to: email,
      subject: 'Reset your password',
      text: 'Your password reset code is ' + token,
    });
    if (error) throw new Error('Could not send');
  },
});
