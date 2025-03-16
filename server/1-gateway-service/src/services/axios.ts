import axios from 'axios';
import { sign } from 'jsonwebtoken';

import { config } from '../config';

export class AxiosService {
  public axios: ReturnType<typeof axios.create>;

  constructor(baseUrl: string, serviceName: string) {
    this.axios = this.axiosCreateInstance(baseUrl, serviceName);
  }

  public axiosCreateInstance(baseUrl: string, serviceName?: string): ReturnType<typeof axios.create> {
    let reqGatewayToken = '';
    if (serviceName) {
      reqGatewayToken = sign({ id: serviceName }, `${config.GATEWAY_JWT_TOKEN}`);
    }

    const instance: ReturnType<typeof axios.create> = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'Application/json',
        Accept: 'Application/json',
        gatewayToken: reqGatewayToken
      },
      withCredentials: true
    });

    return instance;
  }
}
