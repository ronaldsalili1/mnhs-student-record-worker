export default {
    api: {
        host: 'http://mnhs-student-record-api:3000',
    },
    worker: {
        domain: 'mnhs-student-record-rabbitmq',
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
