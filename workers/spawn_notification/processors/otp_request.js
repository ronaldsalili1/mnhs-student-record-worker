import config from '../../../config/index.js';
import { createNotification } from '../../../helpers/api/notifications.js';

export default async ({ logger, payload }) => {
    const {
        to,
        first_name,
        last_name,
        otp,
    } = payload;
    const expectedFields = ['to', 'otp', 'first_name', 'last_name'];
    const hasAllFields = expectedFields.every((key) => key in payload);
    if (!hasAllFields) {
        logger.info('Lacking required fields');
        return [];
    }
    const notifications = [];

    const content = `
        <p>Dear ${first_name} ${last_name},</p>

        <p>
            Your OTP for secure access: <strong>${otp}</strong>
        </p>

        <p>
            For your protection, do not share this code with anyone.<br/>
            Please note that the OTP is only valid for 15 minutes.
            If you didn't make this request, you can disregard this email.
        </p><br/><br/>
        
        <span>Regards,</span><br/>
        <span><em>MNHS Student Record System</em></span>
    `;

    const notification = await createNotification({
        notification: {
            channel: 'email',
            type: 'otp_request',
            to,
            from: config.smtp.from,
            subject: 'Login OTP',
            content,
        },
    });

    notifications.push(notification);

    return notifications;
};
