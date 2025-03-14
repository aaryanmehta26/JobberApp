import { Logger } from 'winston';
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthHealthResponseBody } from '@elastic/elasticsearch/lib/api/types';

import { winstonLogger } from '../../jobber-shared/src';

import { config } from './config';


const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'apiGatewayElasticConnection', 'debug');

class ElasticSearch {
  private elasticSearchClient: Client;

  constructor() {
    this.elasticSearchClient = new Client({
      node: `${config.ELASTIC_SEARCH_URL}`
    });
  }

  public checkConnection = async (): Promise<void> => {
    let isConnected = false;

    while (!isConnected) {
      try {
        const health: ClusterHealthHealthResponseBody = await this.elasticSearchClient.cluster.health({});
        log.info(`Gateway Service Elasticsearch health status - ${health.status}`);
        isConnected = true;
      } catch (error) {
        log.error('Connection to Elasticsearch failed. Retrying...');
        log.log('error', 'NotificationService checkConnection() method:', error);
      }
    }
  };
}

export const elasticSearch: ElasticSearch = new ElasticSearch();
