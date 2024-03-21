import amqp from 'amqplib';

import config from './config/index.js';
import Logger from './helpers/logger.js';

const workerName = process.env.WORKER_NAME;
const username = process.env.AMQP_USERNAME;
const password = process.env.AMQP_PASSWORD;
const {
    domain,
    port,
    vhost,
    queuePrefix,
} = config.worker;

async function start() {
    if (!workerName) {
        throw new Error('WORKER_NAME flag is required to start worker');
    }

    const QUEUE_NAME = `${queuePrefix}_${workerName}`;
    const DEAD_LETTER_QUEUE_NAME = `${QUEUE_NAME}_buried`;
    const amqpHost = `amqp://${username}:${password}@${domain}:${port}/${vhost}`;

    try {
        const connection = await amqp.connect(amqpHost);
        const channel = await connection.createChannel();
        const Worker = await import(`./workers/${workerName}/index.js`);
        const logger = new Logger({ name: QUEUE_NAME });
        // eslint-disable-next-line new-cap
        const worker = new Worker.default({ logger, channel });

        await channel.assertQueue(QUEUE_NAME, {
            durable: true,
        });

        await channel.assertQueue(DEAD_LETTER_QUEUE_NAME, {
            durable: true,
        });

        await channel.consume(QUEUE_NAME, async (payload) => {
            logger.line();

            let jsonPayload;
            let success = false;

            try {
                jsonPayload = JSON.parse(payload.content.toString());
            } catch (e) {
                logger.error('Failed to parse payload');
            }

            logger.info('New Job - ', jsonPayload);

            try {
                success = await worker.run({ payload: jsonPayload });
                logger.info('END: Success');
            } catch (e) {
                logger.error(e.message);
                logger.info('END: Error');
            }

            if (!success) {
                // Put to bury queue
                await channel.sendToQueue(DEAD_LETTER_QUEUE_NAME, payload.content);
            }
            channel.ack(payload);
        });

        logger.info('Worker is now running...');
    } catch (error) {
        console.error(error);
    }
}

start().catch((e) => {
    console.log('WORKER ERROR: ', e);
    process.exit(1);
});

process.on('SIGINT', () => process.exit(0));
