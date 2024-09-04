# Incoming Messages Queue

This project simulates handling high volumes of incoming messages from a messaging service, such as WhatsApp or a customer service chat.

It consists of three main components:
- RabbitMQ Queue: Manages the reception of incoming messages.
- Mock Messaging Service: Simulates different workloads for testing purposes.
- 2 (or more) Backend Processors: Handle the asynchronous processing of messages.

## Run application

`docker-compose up -d`

## Monitoring

RabbitMQ admin panel will be available on [http://localhost:15672](http://localhost:15672)

To see logs from each container:

```bash
docker logs -f rabbitmq-incoming-messages
docker logs -f mock-messaging-service
docker logs -f message-processor
docker logs -f message-processor-2
```

## RabbitMQ utils

To generate a password hash, use the following command:

`docker exec rabbitmq-incoming-messages rabbitmqctl hash_password foobarbaz`