export default {
    api: {
        host: 'http://localhost:3000',
    },
    worker: {
        domain: '127.0.0.1',
        port: 5672,
        vhost: '',
        queuePrefix: 'mnhs',
    },
    smtp: {
        from: 'MNHS Student Record System <noreply@mnhs.com>',
        host: 'smtp-relay.brevo.com',
        port: 587,
    },
};
