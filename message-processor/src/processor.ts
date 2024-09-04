import { Message } from 'amqplib/callback_api'

const processMessage = async (msg: Message | null): Promise<void> => {
  
  if(msg === null){
    throw new Error("Null message received.");
  }

  if(process.env?.NODE_ENV == "development"){
    await new Promise(resolve => setTimeout(resolve, parseInt(process.env.TIME_TO_PROCESS_EACH_MESSAGE || "300")));
  }

  const msgData = JSON.parse(msg.content.toString());

  if(process.env?.NODE_ENV == "development" && Math.random() < 0.1){
    throw new Error("Randomly requeuing this message.");
  }

  console.log(" [x] Received message: %s", msgData.msg);

}

export {
  processMessage
};