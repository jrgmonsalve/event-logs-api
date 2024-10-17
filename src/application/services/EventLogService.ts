import { EventLogRepository } from '../../domain/repository/EventLogRepository';
import { EventLogRepositoryDynamoDB } from '../../infrastructure/repositories/EventLogRepositoryDynamoDB';
import { EventLog } from '../../domain/entity/EventLog';

export class EventLogService {
  private eventLogRepository: EventLogRepository;

  constructor(eventLogRepository: EventLogRepository) {
    this.eventLogRepository = eventLogRepository;
  }

  async getEventLogs(queryParams: any) {
    const { startDate, endDate, type } = queryParams;
    return this.eventLogRepository.findEventLogs(startDate, endDate, type);
  }

  async createEventLog(data: any) {
    const eventLog = new EventLog(data.date, data.description, data.type);
    return this.eventLogRepository.save(eventLog);
  }

  async processEventLog(eventLog: EventLog) {
    console.log('Processing eventLog:', eventLog);
  }
}
