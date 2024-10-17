import { EventLog } from '../entity/EventLog';

export interface EventLogRepository {
  findEventLogs(startDate?: string, endDate?: string, type?: string): Promise<EventLog[]>;
  save(eventLog: EventLog): Promise<void>;
}
