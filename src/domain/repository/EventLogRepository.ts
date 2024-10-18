import { EventLog } from '../entity/EventLog';

export interface EventLogRepository {
  find(startDate?: string, 
    endDate?: string, 
    type?: string,
    page?: number,
    pageSize?: number
  ): Promise<{ data: EventLog[]; total: number }>;
  save(eventLog: EventLog): Promise<void>;
}
