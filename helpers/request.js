import { objectToQueryString } from './general.js';
import { generateResponse } from './response.js';

const options = {
    cache: 'no-cache',
    headers: {
        'Content-Type': 'application/json',
        'worker-api-key': process.env.WORKER_API_KEY,
    },
    referrerPolicy: 'no-referrer',
};

export const get = async ({ uri, query }) => {
    let queryString = '';

    if (query) {
        queryString = objectToQueryString(query);
    }

    try {
        const response = await fetch(`${process.env.API}${uri}${queryString}`, {
            ...options,
            method: 'GET',
        });

        const jsonResponse = await response.json();

        return jsonResponse;
    } catch (error) {
        console.error(error);
        return generateResponse(500, error.message);
    }
};

export const post = async ({ uri, query, body = {} }) => {
    let queryString = '';

    if (query) {
        queryString = objectToQueryString(query);
    }

    try {
        const response = await fetch(`${process.env.API}${uri}${queryString}`, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });

        console.log('🚀 ~ response:', response);

        const jsonResponse = await response.json();

        return jsonResponse;
    } catch (error) {
        console.error(error);
        return generateResponse(500, error.message);
    }
};

export const patch = async ({ uri, query, body = {} }) => {
    let queryString = '';

    if (query) {
        queryString = objectToQueryString(query);
    }

    try {
        const response = await fetch(`${process.env.API}${uri}${queryString}`, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body),
        });

        const jsonResponse = await response.json();

        return jsonResponse;
    } catch (error) {
        console.error(error);
        return generateResponse(500, error.message);
    }
};
