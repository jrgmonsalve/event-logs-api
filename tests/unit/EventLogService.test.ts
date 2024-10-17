import { EventLogService } from '../../src/application/services/EventLogService';
import { EventLogRepository } from '../../src/domain/repository/EventLogRepository';
import { EventLog } from '../../src/domain/entity/EventLog';

// Mock del repositorio
const mockEventLogRepository: EventLogRepository = {
  findEventLogs: jest.fn(),
  save: jest.fn(),
};

const eventLogService = new EventLogService(mockEventLogRepository);

describe('EventLogService', () => {
  it('should create an EventLog', async () => {
    const eventData = { date: '2024-01-01', description: 'Test event', type: 'API' };
    await eventLogService.createEventLog(eventData);

    expect(mockEventLogRepository.save).toHaveBeenCalledWith(new EventLog(
      eventData.date,
      eventData.description,
      eventData.type
    ));
  });

  it('should list EventLogs with filters', async () => {
    const queryParams = { startDate: '2024-01-01', endDate: '2024-02-01', type: 'API' };
    await eventLogService.getEventLogs(queryParams);

    expect(mockEventLogRepository.findEventLogs).toHaveBeenCalledWith(
      queryParams.startDate,
      queryParams.endDate,
      queryParams.type
    );
  });
});
