console.log("Starting mock messaging service!");

var amqp = require('amqplib/callback_api');

const rabbitmqUser = process.env.RABBITMQ_USER || 'userpublisher';
const rabbitmqPass = process.env.RABBITMQ_PASS || 'passpublisher';
const rabbitmqHost = process.env.RABBITMQ_HOST || 'rabbitmq-incoming-host';
const rabbitmqPort = process.env.RABBITMQ_PORT || '5672';
const rabbitmqVhost = process.env.RABBITMQ_VHOST || '/vhost1';
const rabbitmqQueue = process.env.RABBITMQ_QUEUE || 'incoming_messages';

const rabbitmqUrl = `amqp://${rabbitmqUser}:${rabbitmqPass}@${rabbitmqHost}:${rabbitmqPort}${rabbitmqVhost}`;
console.log(rabbitmqUrl);

amqp.connect(rabbitmqUrl, function(error0: Error, connection: any) {

  if (error0) {
    console.log(error0);
    throw error0;
  }

  connection.createChannel(function(error1: Error, channel: any) {

    if (error1) {
      console.log(error1);
      throw error1;
    }

    sendMessagesInRandomIntervals(channel, rabbitmqQueue, 100);

  });

});

const sendMessagesInRandomIntervals = (channel: any, queue: string, maxTime: number) => {

  setTimeout(() => {

    const msg = generateRandomString(1 + Math.round(Math.random() * 99));
    const data = {
      msg: msg,
      meta: Date.now().toString()
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
      persistent: true,
      contentType: 'application/json',
    });
    console.log(" [x] Sent %s", msg);
    
    sendMessagesInRandomIntervals(channel, queue, maxTime);

  }, Math.ceil(Math.random() * maxTime));

};

const generateRandomString = (length: number) => {

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;

};
