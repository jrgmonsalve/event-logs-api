import { EventLogService } from '../../src/application/services/EventLogService';
import { EventLogRepository } from '../../src/domain/repository/EventLogRepository';
import { EventLog } from '../../src/domain/entity/EventLog';
import { EventTypeEnum } from '../../src/domain/enums/EventTypeEnum';

// Mock del repositorio
const mockEventLogRepository: EventLogRepository = {
  find: jest.fn(),
  save: jest.fn(),
};

const eventLogService = new EventLogService(mockEventLogRepository);

describe('EventLogService', () => {
  it('should create an EventLog', async () => {
    const eventData = { date: '2024-01-01', description: 'Test event', type: 'API' };
    const eventLog = new EventLog(eventData.date, eventData.description as EventTypeEnum, eventData.type);
    await eventLogService.createEventLog(eventLog);

    expect(mockEventLogRepository.save).toHaveBeenCalledWith(new EventLog(
      eventData.date,
      eventData.description as EventTypeEnum,
      eventData.type
    ));
  });

  it('should list EventLogs with filters', async () => {
    const queryParams = { startDate: '2024-01-01', endDate: '2024-02-01', type: 'API' };
    await eventLogService.getEventLogs(queryParams);

    expect(mockEventLogRepository.find).toHaveBeenCalledWith(
      queryParams.startDate,
      queryParams.endDate,
      queryParams.type
    );
  });
});
