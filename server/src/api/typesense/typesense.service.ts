import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { withPulse } from '@prisma/extension-pulse';
import Typesense from 'typesense';

@Injectable()
export class TypesenseService {
  private readonly logger = new Logger(TypesenseService.name);
  private client: any;
  async createClient(): Promise<any> {
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

  async createDentistCollection(): Promise<any> {
    const schema = {
      name: 'doctor',
      fields: [{ name: '.*', type: 'auto' }],
    };
    const resp = await this.client.collections().create(schema);
    this.logger.log('Typesense client connected');
    //const tableData = await this.client.collections('doctor').retrieve();
    //this.logger.log('Table Data >>>>>>>>>', tableData);
    return resp;
  }

  async streamDentistCollection(): Promise<any> {
    try {
      const prisma = new PrismaClient().$extends(
        withPulse({
          apiKey: process.env['PULSE_API_KEY'] as string,
        }),
      );
      const stream = await prisma.dentist.stream();
      this.logger.log('stream started:', stream);
      for await (const event of stream) {
        switch (event.action) {
          case 'create':
            this.logger.log('just created an event:', event);
            const newUser = event.created;
            this.logger.log('newUser:', newUser);
            const res = await this.client
              .collections('doctor')
              .documents()
              .create({ ...newUser, id: String(newUser.id) });
            this.logger.log('res:', res);
            break;
          case 'update':
            this.logger.log('just updated an event:', event);
            const updatedUser = event.after;
            this.logger.log('updatedUser:', updatedUser);

            break;
          case 'delete':
            this.logger.log('just deleted an event:', event);
            const deletedUserId = event.deleted.id;
            this.logger.log('deletedUserId:', deletedUserId);
            break;
        }
      }

      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async searchFromTypesenseCollection(data: any): Promise<any> {
    const searchParameters = {
      q: data.q,
      query_by: [data.query_by],
      filter_by: data.filter_by,
      sort_by: data.sort_by,
    };
    const resp = await this.client
      .collections(data.name)
      .documents()
      .search(searchParameters);
    this.logger.log('Typesense search success');
    return resp;
  }
}
