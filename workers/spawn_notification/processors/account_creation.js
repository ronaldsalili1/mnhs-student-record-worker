import config from '../../../config/index.js';
import { createNotification } from '../../../helpers/api/notifications.js';

export default async ({ logger, payload }) => {
    const {
        to,
        first_name,
        last_name,
        password,
        link,
    } = payload;
    const expectedFields = ['to', 'password', 'first_name', 'last_name', 'link'];
    const hasAllFields = expectedFields.every((key) => key in payload);
    if (!hasAllFields) {
        logger.info('Lacking required fields');
        return [];
    }
    const notifications = [];

    const content = `
        <p>Dear ${first_name} ${last_name},</p>

        <p>The following are your temporary credentials. Please change your password after logging in.</p>
        
        <span>
            <strong>URL:</strong>
            <a href=${link}>
                ${link}
            </a>
        </span><br/>
        <span><strong>Email:</strong> ${to}</span><br/>
        <span><strong>Password:</strong> ${password}</span><br/><br/>
        
        <span>Regards,</span><br/>
        <span><em>MNHS Student Record System</em></span>
    `;

    const notification = await createNotification({
        notification: {
            channel: 'email',
            type: 'account_creation',
            to,
            from: config.smtp.from,
            subject: 'Account Creation',
            content,
        },
    });

    notifications.push(notification);

    return notifications;
};
