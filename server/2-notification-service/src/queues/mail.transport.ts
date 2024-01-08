import { Logger } from 'winston';

import { IEmailLocals, winstonLogger } from '../../../jobber-shared/src';
import { config } from '../config';
import { emailTemplates } from '../helpers';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');

async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> {
  try {
    emailTemplates(template, receiverEmail, locals);
    log.info('Email sent successfully.');
  } catch (error) {
    log.log('error', 'NotificationService MailTransport sendEmail() method error:', error);
  }
}

export { sendEmail };