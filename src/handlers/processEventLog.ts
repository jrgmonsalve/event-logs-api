import { SQSEvent } from 'aws-lambda';
import { EventLogService } from '../application/services/EventLogService';
import { EventLogRepositoryDynamoDB } from '../infrastructure/repositories/EventLogRepositoryDynamoDB';
import { EventLogRepositoryAuroraDB } from '../infrastructure/repositories/EventLogRepositoryAuroraDB';

export const processEventLogHandler = async (event: SQSEvent) => {
  // Selección de repositorio basado en la variable de ambiente
  const databaseType = process.env.DATABASE_TYPE || 'DynamoDB';
  let eventLogRepository;

  if (databaseType === 'Aurora') {
    eventLogRepository = new EventLogRepositoryAuroraDB();
  } else {
    eventLogRepository = new EventLogRepositoryDynamoDB();
  }

  const eventLogService = new EventLogService(eventLogRepository);

  // Procesar cada mensaje en la cola SQS
  for (const record of event.Records) {
    try {
      const eventLogData = JSON.parse(record.body);
      await eventLogService.createEventLog(eventLogData);
      console.log(`EventLog processed and saved: ${record.messageId}`);
    } catch (error) {
      console.error(`Error processing eventLog: ${record.messageId}`, error);
    }
  }
};
