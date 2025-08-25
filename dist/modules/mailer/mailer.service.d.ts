export declare class MailerService {
    private transporter;
    constructor();
    sendMail(options: {
        to: string;
        subject: string;
        html: string;
        from?: string;
        attachments?: any[];
    }): Promise<string>;
    sendGuestQrCodeEmail(guest: {
        firstName: string;
        email: string;
    }, qrCode: {
        alphanumericCode: string;
        qrCodeImage: string;
    }): Promise<string>;
}
