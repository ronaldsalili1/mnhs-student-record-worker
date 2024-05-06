ARG NODE_VERSION=21.7.1

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create an entrypoint script
RUN printf '#!/bin/sh\nnpm run start:spawn_notification & npm run start:send_notification' > entrypoint.sh && \
    chmod +x entrypoint.sh

# Use the entrypoint script as the CMD
CMD ["/app/entrypoint.sh"]