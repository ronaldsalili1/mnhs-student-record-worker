# mnhs-student-record-worker

## Node Version:
- v21.7.1

## Run the project
1. Create a .env file and add the env variables to run the project.
2. Install dependencies. "npm install"
3. Run spawn notification worker. "npm run start:spawn_notification"
4. Open new terminal and run send notification worker. "npm run start:send_notification"

## Env variables needed to run the project in development
AMQP_USERNAME=
AMQP_PASSWORD=

WORKER_API_KEY=

SMTP_USER=
SMTP_PASSWORD=