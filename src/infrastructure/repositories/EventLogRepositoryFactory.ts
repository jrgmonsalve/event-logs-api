// src/infrastructure/repositories/EventLogRepositoryFactory.ts
import { EventLogMapper } from '../../application/mappers/EventLogMapper';
import { EventLogRepository } from '../../domain/repository/EventLogRepository';
import { RdsClient } from '../database/RdsClient';
import { EventLogRepositoryDynamoDB } from './EventLogRepositoryDynamoDB';
import { EventLogRepositoryMysqlDB } from './EventLogRepositoryMysqlDB';


enum RepositoryTypeEnum {
    DYNAMODB = 'DYNAMODB',
    RDS_INSTANCE = 'RDS_INSTANCE',
}

export const getEventLogRepository = (): EventLogRepository => {
  const databaseType = process.env.DATABASE_TYPE || RepositoryTypeEnum.DYNAMODB;

  if (databaseType === RepositoryTypeEnum.RDS_INSTANCE) {
    const databaseClient = new RdsClient(
        process.env.RDS_INSTANCE_ARN || '',
        process.env.DB_SECRET_ARN || '',
        process.env.DB_NAME || ''
    );
    const mapper = new EventLogMapper();
    return new EventLogRepositoryMysqlDB(databaseClient, mapper);
  } else {
    return new EventLogRepositoryDynamoDB();
  }
};
