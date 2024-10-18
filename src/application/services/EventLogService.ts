import { EventLogRepository } from '../../domain/repository/EventLogRepository';
import { EventLog } from '../../domain/entity/EventLog';
import { PaginatedEventLogDTO } from '../../domain/dto/PaginatedEventLogDTO';

export class EventLogService {
    private eventLogRepository: EventLogRepository;

    constructor(eventLogRepository: EventLogRepository) {
        this.eventLogRepository = eventLogRepository;
    }

    async getEventLogs(queryParams: any): Promise<PaginatedEventLogDTO> {
      const { startDate, endDate, type, page = 1, pageSize = 10 } = queryParams;
      const pageNumber = parseInt(page, 10);
      const size = parseInt(pageSize, 10);
      
      const { data, total } = await this.eventLogRepository.find(startDate, endDate, type, pageNumber, size);

      const from = (pageNumber - 1) * size + 1;
      const to = Math.min(pageNumber * size, total);
      const nextPageUrl = pageNumber * size < total ? `?page=${pageNumber + 1}&page_size=${size}` : null;
      const prevPageUrl = pageNumber > 1 ? `?page=${pageNumber - 1}&page_size=${size}` : null;
      const firstPageUrl = `?page=1&page_size=${size}`;

      return new PaginatedEventLogDTO(
          pageNumber,
          data,
          from,
          to,
          size,
          total,
          nextPageUrl,
          prevPageUrl,
          firstPageUrl
      );
  }

    async createEventLog(eventLog: EventLog) {
        return this.eventLogRepository.save(eventLog);
    }
}
