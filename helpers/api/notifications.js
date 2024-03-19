import { get, patch, post } from '../request.js';

export const getNotificationById = async (id) => {
    const response = await get({ uri: `/worker/notifications/${id}` });
    if (response.meta.code !== 200) {
        throw new Error(response.meta.message);
    }

    return response.data.notification;
};

export const createNotification = async (body) => {
    const response = await post({
        uri: '/worker/notifications',
        body,
    });

    if (response.meta.code !== 200) {
        throw new Error(response.meta.message);
    }

    return response.data.notification;
};

export const updateNotificationStatusById = async (id, body) => {
    const response = await patch({
        uri: `/worker/notifications/${id}/status`,
        body,
    });

    if (response.meta.code !== 200) {
        throw new Error(response.meta.message);
    }

    return response.data.notification;
};
