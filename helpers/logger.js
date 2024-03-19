import dayjs from 'dayjs';

export default class Logger {
    constructor({ name }) {
        this.name = name;
    }

    info(...logs) {
        console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')} || ${this.name} || `, ...logs);
    }

    error(...logs) {
        console.error(`${dayjs().format('YYYY-MM-DD HH:mm:ss')} || ${this.name} || `, ...logs);
    }

    // eslint-disable-next-line class-methods-use-this
    line() {
        console.log('===================================================================');
    }
}
