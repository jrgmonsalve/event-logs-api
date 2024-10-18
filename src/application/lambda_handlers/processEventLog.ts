import { SQSEvent, SQSRecord } from 'aws-lambda';
import { EventLogService } from '../../application/services/EventLogService';
import { getEventLogRepository } from '../../infrastructure/repositories/EventLogRepositoryFactory';
import { EventLogMapper } from '../mappers/EventLogMapper';

export const processEventLogHandler = async (event: SQSEvent) => {
  console.log('Processing SQS event:', event);
  const mapper = new EventLogMapper();
  const eventLogRepository = getEventLogRepository();
  const eventLogService = new EventLogService(eventLogRepository);

  for (const record of event.Records) {
    try {
      const data = getBody(record);
      const eventLog = mapper.mapToEventLog(data);
      await eventLogService.createEventLog(eventLog);
      console.log(`EventLog processed and saved: ${record.messageId}`);
    } catch (error) {
      console.error(`Error processing eventLog: ${record.messageId}`, error);
    }
  }
};
const getBody = (data: SQSRecord) => {
  return JSON.parse(data.body || '{}');
}