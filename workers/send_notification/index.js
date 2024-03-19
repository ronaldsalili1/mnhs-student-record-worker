import _ from 'lodash';

import Logger from '../../helpers/logger.js';
import { getNotificationById, updateNotificationStatusById } from '../../helpers/api/notifications.js';
import sendEmail from '../../helpers/nodemailer.js';

const name = process.env.WORKER_NAME;

export default class SendNotification {
    constructor() {
        this.logger = new Logger({ name });
        this.logger.info(`${name} worker is now running...`);
    }

    async run({ payload }) {
        this.logger.line();

        if (!this.isPayloadValid(payload)) {
            this.logger.info('Error - Invalid payload');
            return false;
        }

        try {
            await this._run(payload);
        } catch (e) {
            this.logger.info(e);
            throw e;
        }
        this.logger.info('Completed');

        return true;
    }

    async _run(payload) {
        this.logger.info('Get notification by id');
        const notification = await getNotificationById(payload.notification_id);
        const {
            to,
            cc,
            bcc,
            subject,
            content,
        } = notification;
        let status = 'sent';

        try {
            const res = await sendEmail({
                to,
                cc,
                bcc,
                subject,
                html: content,
            });
            this.logger.info('Email status => ', res);
            this.logger.info('Update notification by id');
        } catch (e) {
            this.logger.info('Email error - ', e);
            status = 'cancelled';
        }
        await updateNotificationStatusById(notification._id, {
            notification: {
                status,
            },
        });
        this.logger.info('Processed email');
        return 'success';
    }

    // eslint-disable-next-line class-methods-use-this
    isPayloadValid(payload) {
        const expectedFields = ['notification_id'];
        const hasAllFields = expectedFields.every((key) => key in payload);
        return _.isObject(payload) && hasAllFields;
    }
}
