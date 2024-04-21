import config from '../../../config/index.js';
import { createNotification } from '../../../helpers/api/notifications.js';

export default async ({ logger, payload }) => {
    const {
        to,
        first_name,
        last_name,
        link,
    } = payload;
    const expectedFields = ['to', 'first_name', 'last_name', 'link'];
    const hasAllFields = expectedFields.every((key) => key in payload);
    if (!hasAllFields) {
        logger.info('Lacking required fields');
        return [];
    }
    const notifications = [];

    const content = `
        <p>Dear ${first_name} ${last_name},</p>

        <p>
            You recently requested to reset your password for your MNHS Student Record System account.
            To proceed with the password reset, please click the link below:
        </p>
        
        <a href=${link} style="margin: 20px 0px">
            ${link}
        </a>

        <p>
            Please note that the link is only valid for 15 minutes.
            If you didn't make this request, you can disregard this email.
        </p>
        
        <span>Regards,</span><br/>
        <span><em>MNHS Student Record System</em></span>
    `;

    const notification = await createNotification({
        notification: {
            channel: 'email',
            type: 'password_reset_request',
            to,
            from: config.smtp.from,
            subject: 'Password Reset Request',
            content,
        },
    });

    notifications.push(notification);

    return notifications;
};
