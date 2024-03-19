import amqp from 'amqplib';

import Logger from './helpers/logger.js';

const username = process.env.AMQP_USERNAME;
const password = process.env.AMQP_PASSWORD;
const host = process.env.AMQP_HOST;
const port = process.env.AMQP_PORT;
const vhost = process.env.AMQP_VHOST;

async function start() {
    const { WORKER_NAME } = process.env;

    if (!WORKER_NAME) {
        throw new Error('WORKER_NAME flag is required to start worker');
    }

    const SYSTEM_PREFIX = process.env.AMQP_QUEUE_PREFIX;
    const QUEUE_NAME = `${SYSTEM_PREFIX}_${WORKER_NAME}`;
    const DEAD_LETTER_QUEUE_NAME = `${QUEUE_NAME}_buried`;
    const amqpHost = `amqp://${username}:${password}@${host}:${port}/${vhost}`;

    try {
        const connection = await amqp.connect(amqpHost);
        const channel = await connection.createChannel();
        const Worker = await import(`./workers/${WORKER_NAME}/index.js`);
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
