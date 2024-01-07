import 'express-async-errors';
import * as http from 'http';

import { Logger } from 'winston';
import {Application} from 'express';
import { Channel } from 'amqplib';

import { winstonLogger } from '../../jobber-shared/src';

import { config } from './config';
import { healthRoutes } from './routes';
import { checkConnection } from './elasticsearch';
import { createConnection } from './queues/connection';
import { consumeAuthEmailMessages } from './queues/email.consumer';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export const start = (app: Application): void => {
  startServer(app);
  app.use('', healthRoutes);
  startQueues();
  startElasticSearch();
};

export const startQueues = async (): Promise<void> => {
  const emailChannel = await createConnection() as Channel;
  await consumeAuthEmailMessages(emailChannel);
};

export const startElasticSearch = ():void => {
  checkConnection();
};

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`); // these log will get into kibana dashboard
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });

  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
};