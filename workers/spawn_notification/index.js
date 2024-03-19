import _ from 'lodash';
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
        console.log('🚀 ~ payload:', payload);
        if (!this.isPayloadValid(payload)) {
            return true;
        }

        console.log('🚀 ~ processors:', processors);

        this.logger.line();

        const notifications = await processors[payload.type]({ logger: this.logger, payload });

        // Put to send_notification
        _.forEach(notifications, async (notification) => {
            const queuePrefix = process.env.AMQP_QUEUE_PREFIX;
            await this.channel.sendToQueue(`${queuePrefix}_send_notification`, Buffer.from(JSON.stringify({
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
