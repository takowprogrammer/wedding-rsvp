export declare class MailerService {
    private transporter;
    constructor();
    sendMail(options: {
        to: string;
        subject: string;
        html: string;
        from?: string;
    }): Promise<string>;
}
