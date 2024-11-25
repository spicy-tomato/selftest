// prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Pass PrismaClient options to the constructor
    super({
      log: ['error', 'warn', 'query'], // Log all queries, warnings and errors
      errorFormat: 'pretty', // Format errors in a readable way
    });
  }

  async onModuleInit() {
    // Connect to the database when the module initializes
    try {
      await this.$connect();
      console.log('Successfully connected to database');

      // Add Prisma middleware for logging (optional)
      this.$use(async (params, next) => {
        const before = Date.now();
        const result = await next(params);
        const after = Date.now();
        console.log(
          `Query ${params.model}.${params.action} took ${after - before}ms`,
        );
        return result;
      });
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    // Disconnect from the database when the module is destroyed
    await this.$disconnect();
  }

  async cleanDatabase() {
    // Helper method for cleaning database (useful in testing)
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    ) {
      const models = Reflect.ownKeys(this).filter(
        (key) => typeof key === 'symbol' || key[0] !== '_',
      );

      return Promise.all(
        models.map((modelKey) => {
          return (this[modelKey as keyof this] as any).deleteMany();
        }),
      );
    }
  }
}
