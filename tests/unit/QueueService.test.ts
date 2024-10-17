import { QueueService } from '../../src/application/services/QueueService';
import { QueueRepository } from '../../src/domain/repository/QueueRepository';

const mockQueueRepository: jest.Mocked<QueueRepository> = {
  sendMessage: jest.fn(),
};

describe('QueueService', () => {
  let queueService: QueueService;

  beforeEach(() => {
    queueService = new QueueService(mockQueueRepository);
  });

  it('should enqueue event log', async () => {
    const eventLog = { date: '2024-01-01', description: 'Test Event', type: 'API' };
    await queueService.enqueueEventLog(eventLog);

    expect(mockQueueRepository.sendMessage).toHaveBeenCalledWith(eventLog);
  });
});
