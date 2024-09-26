import { Injectable } from '@nestjs/common';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

@Injectable()
export class EmailService {
  private readonly apiInstance: SibApiV3Sdk.TransactionalEmailsApi;

  constructor() {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.EMAIL_KEY;

    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  }

  async sendEmailToUser(
    candidateInfo: any,
    subject: string = '',
    body: string = '',
    companyInfo: any,
  ): Promise<any> {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject ? subject : 'Not configured';
    sendSmtpEmail.sender = {
      name: companyInfo.username,
      email: 'hello@axceera.com',
    };
    sendSmtpEmail.to = [{ email: candidateInfo.email }];
    sendSmtpEmail.htmlContent = `<html><body>
            <h3>Hello ${candidateInfo.name} ,</h3>
            <div>${body ? body : 'Not configured'}</div>
            <p>Thank you</p>
            <p>Recruiter team</p>
            </body></html>`;

    try {
      const maildata = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      return maildata;
    } catch (error) {
      throw error;
    }
  }

  async sendPasswordResetLink(email: string, link: string): Promise<any> {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = 'Reset Password';
    sendSmtpEmail.sender = { name: 'Axceera', email: 'hello@axceera.com' };
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.htmlContent = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
                    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                    h3 { color: #333333; }
                    p { color: #666666; line-height: 1.5; }
                    .button { display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px; }
                    .footer { margin-top: 20px; font-size: 12px; color: #999999; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h3>Hello ${email},</h3>
                    <div>We received a request to reset your password. Click the button below to reset your password.</div>
                    <div><a href="${link}" class="button">Reset Password</a></div>
                    <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                    <p>Thank you,<br>The Recruiter Team</p>
                    <div class="footer"><p>If you have any questions, feel free to <a href="mailto:hello@axceera.com">contact us</a>.</p></div>
                </div>
            </body>
            </html>
        `;

    try {
      const maildata = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      return maildata;
    } catch (error) {
      throw error;
    }
  }
}
