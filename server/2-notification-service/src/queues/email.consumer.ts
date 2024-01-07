import { Logger } from 'winston';
import { Channel, ConsumeMessage } from 'amqplib';

import { winstonLogger } from '../../../jobber-shared/src';
import { config } from '../config';

import { createConnection } from './connection';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');

async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'jobber-email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    // durable true, if queue restarts, and the message is not consumme, it will persist the message
    // by default its false
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      console.log('### cosuming message',JSON.parse(msg!.content.toString()));
      // send emails
      // acknowledge
    });
  } catch (error) {
    log.log('error', 'NotificationService EmailConsumer consumeAuthEmailMessages() method error:', error);
  }
};

export {consumeAuthEmailMessages};
