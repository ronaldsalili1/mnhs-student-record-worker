import _ from 'lodash';

import config from '../../config/index.js';
import processors from './processors/index.js';

export default class Worker {
    constructor({ logger, channel }) {
        this.logger = logger;
        this.channel = channel;
    }

    /*
    * Function entry point
    * @return (boolean) - true: success, false: put to bury queue
    */
    async run({ payload }) {
        if (!this.isPayloadValid(payload)) {
            return true;
        }

        this.logger.line();

        const notifications = await processors[payload.type]({ logger: this.logger, payload });

        // Put to send_notification
        _.forEach(notifications, async (notification) => {
            await this.channel.sendToQueue(`${config.worker.queuePrefix}_send_notification`, Buffer.from(JSON.stringify({
                notification_id: notification._id,
            })));
        });
        return true;
    }

    // eslint-disable-next-line class-methods-use-this
    isPayloadValid(payload) {
        const isObject = _.isObject(payload);
        return isObject;
    }
}
