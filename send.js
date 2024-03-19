import amqp from 'amqplib/callback_api.js';

const username = process.env.AMQP_USERNAME;
const password = process.env.AMQP_PASSWORD;
const host = process.env.AMQP_HOST;
const port = process.env.AMQP_PORT;
const vhost = process.env.AMQP_VHOST;
const amqpHost = `amqp://${username}:${password}@${host}:${port}/${vhost}`;

amqp.connect(amqpHost, (error0, connection) => {
    if (error0) {
        throw error0;
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }
        const queue = `${process.env.AMQP_QUEUE_PREFIX}_task_queue`;
        const msg = 'Hello Ronald.....';

        channel.assertQueue(queue, {
            durable: true,
        });

        channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true,
        });
        console.log(' [x] Sent %s', msg);
    });

    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
});
