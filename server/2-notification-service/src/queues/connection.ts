import { Logger } from 'winston';
import client, { Channel, Connection } from 'amqplib';

import { winstonLogger } from '../../../jobber-shared/src';
import { config } from '../config';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationQueueConnection', 'debug');

const createConnection = async(): Promise<Channel | undefined> => {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Notification server connected to queue successfully...');
    closeConnection(channel, connection);
    return channel;
    } catch (error) {
      log.log('error', 'NotificationService error createConnection() method:', error);
      return undefined;
    }
};

const closeConnection = (channel: Channel, connection: Connection): void => {
  process.once('SIGINT', async() => {
    await channel.close();
    await connection.close();
  });
};

export {createConnection};
