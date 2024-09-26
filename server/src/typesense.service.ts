import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Typesense from 'typesense';

@Injectable()
export class TypesenseService implements OnModuleInit {
  private client: any;

  async onModuleInit() {
    this.client = new Typesense.Client({
      nodes: [
        {
          url: process.env.TYPESENSE_URL, //production

          /* local typesense instance */
          // host: 'localhost', // Your Typesense server address
          // port: '8108',
          // protocol: 'http',
        },
      ],
      apiKey: process.env.TYPESENSE_API_KEY,
      connectionTimeoutSeconds: 2,
    });

    const logger = new Logger('Typesense');
    try {
      await this.client.health.retrieve();
      logger.log('Typesense client connected');
    } catch (error) {
      logger.debug('Failed to connect to Typesense', error);
    }
  }

  getClient(): any {
    return this.client;
  }
}
