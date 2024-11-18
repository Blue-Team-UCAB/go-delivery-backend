export interface IMailSender {
  sendMail(to: string, subject: string, html?: string): Promise<void>;
  sendEmailforAllUsers(subject: string, html: string): Promise<void>;
}
