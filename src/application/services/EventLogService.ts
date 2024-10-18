import { EventLogRepository } from '../../domain/repository/EventLogRepository';
import { EventLog } from '../../domain/entity/EventLog';

export class EventLogService {
  private eventLogRepository: EventLogRepository;

  constructor(eventLogRepository: EventLogRepository) {
    this.eventLogRepository = eventLogRepository;
  }

  async getEventLogs(queryParams: any) {
    const { startDate, endDate, type } = queryParams;
    return this.eventLogRepository.find(startDate, endDate, type);
  }

  async createEventLog(eventLog: EventLog) {
    return this.eventLogRepository.save(eventLog);
  }
}
