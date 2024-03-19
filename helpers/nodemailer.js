import nodemailer from 'nodemailer';
import { convert } from 'html-to-text';

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export default async function sendEmail(data) {
    const {
        to,
        cc,
        bcc,
        subject,
        html,
    } = data;
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    const text = convert(html, { wordwrap: 130 });

    const email = {
        from: process.env.FROM_EMAIL,
        to,
        ...(cc && { cc }),
        ...(bcc && { bcc }),
        subject,
        text,
        html,
    };

    let response;
    for (let i = 0; i < 3; i++) {
        try {
            // eslint-disable-next-line no-await-in-loop
            response = await transporter.sendMail(email);
            break;
        } catch (e) {
            // Retry 3 times only
            if (i === 2) {
                throw e;
            }
        }

        // Retry 2 seconds later
        // eslint-disable-next-line no-await-in-loop
        await sleep(2000);
    }

    return response;
}
