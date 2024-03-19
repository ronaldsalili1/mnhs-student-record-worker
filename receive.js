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

        channel.assertQueue(queue, {
            durable: true,
        });

        console.log('[*] Waiting for messages in %s. To exit press CTRL+C', queue);

        channel.consume(queue, (msg) => {
            const secs = msg.content.toString().split('.').length - 1;
            console.log('🚀 ~ secs:', secs);

            console.log(' [x] Received %s', msg.content.toString());
            setTimeout(() => {
                console.log(' [x] Done');
                channel.ack(msg);
            }, secs * 1000);
        }, {
            noAck: false,
        });
    });
});
