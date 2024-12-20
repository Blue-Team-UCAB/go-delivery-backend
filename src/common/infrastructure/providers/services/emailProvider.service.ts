import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { UserEmailProvider } from '../../../../auth/infrastructure/provider/userEmail.provider';
import { IMailSender } from '../../../application/mail-sender/mail-sender.interface';

@Injectable()
export class MailSenderService implements IMailSender {
  private transporter;

  constructor(private readonly userEmailProvider: UserEmailProvider) {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
    });
  }

  async sendMail(to: string, subject: string, html?: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendEmailforAllUsers(subject: string, html: string): Promise<void> {
    const emails = await this.userEmailProvider.getEmails();
    emails.forEach(email => {
      this.sendMail(email, subject, html);
    });
  }
}
