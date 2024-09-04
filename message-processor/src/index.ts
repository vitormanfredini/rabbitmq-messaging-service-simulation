import amqp from 'amqplib/callback_api'
import { Connection, Message, Channel } from 'amqplib/callback_api'
import { processMessage } from './processor';

const rabbitmqUser = process.env.RABBITMQ_USER || 'userconsumer';
const rabbitmqPass = process.env.RABBITMQ_PASS || 'passconsumer';
const rabbitmqHost = process.env.RABBITMQ_HOST || 'rabbitmq-incoming-host';
const rabbitmqPort = process.env.RABBITMQ_PORT || '5672';
const rabbitmqVhost = process.env.RABBITMQ_VHOST || 'vhost1';
const rabbitmqQueue = process.env.RABBITMQ_QUEUE || 'incoming_messages';

const rabbitmqUrl = `amqp://${rabbitmqUser}:${rabbitmqPass}@${rabbitmqHost}:${rabbitmqPort}/${rabbitmqVhost}`;

let connection: Connection;
let channel: Channel;

const createChannelCallback = (error: Error, _channel: Channel) => {
  
  if (error) {
    console.log("Error creating channel: " + error.message);
    throw error;
  }

  console.log(" [*] Waiting for messages in %s queue.", rabbitmqQueue);
  channel = _channel;
  channel.prefetch(10);
  channel.consume(rabbitmqQueue, onMessageCallback);

};

const onMessageCallback = async (msg: Message | null) => {
    
  try {
    await processMessage(msg);
    channel.ack(msg as Message);
  } catch (error) {
    console.log((error as Error).message);
    channel.nack(msg as Message, false, true);
  }

};

const connect = () => {
  amqp.connect(rabbitmqUrl, function(error: Error, _connection: Connection): void {

    if (error) {
      console.log("Error connecting: " + error.message);
      throw error;
    }

    connection = _connection;
    connection.createChannel(createChannelCallback);
  
  });
}

try {
  connect();
} catch (error) {
  console.log("Couldn't connect to RabbitMQ server.");
  console.log(error);
}

process.on('SIGINT', async () => {
  console.log('Shutting down...');
  if (channel) {
    channel.close(function callback(err: any){
      console.log("Error closing the channel: " +  err);
    });
  }
  if (connection) {
    connection.close();
  }
  process.exit(0);
});