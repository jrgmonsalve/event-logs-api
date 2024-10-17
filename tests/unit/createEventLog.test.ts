import { createEventLogHandler } from '../../src/handlers/createEventLog';
import { QueueService } from '../../src/application/services/QueueService';
import { QueueRepositorySQS } from '../../src/infrastructure/repositories/QueueRepositorySQS';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

jest.mock('../../src/application/services/QueueService');
jest.mock('../../src/infrastructure/repositories/QueueRepositorySQS');

const mockQueueService = new QueueService(new QueueRepositorySQS()) as jest.Mocked<QueueService>;

describe('createEventLogHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return success when event is enqueued', async () => {
    mockQueueService.enqueueEventLog.mockResolvedValue();

    const event = {
      body: JSON.stringify({ date: '2024-01-01', description: 'Test', type: 'API' }),
    } as APIGatewayProxyEvent;

    const response = await createEventLogHandler(event, {} as any, {} as any) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(202);
    expect(JSON.parse(response.body)).toEqual({ message: 'EventLog request enqueued' });
  });

  it('should return error on failure', async () => {
    mockQueueService.enqueueEventLog.mockRejectedValue(new Error('Enqueue error'));

    const event = {
      body: JSON.stringify({ date: '2024-01-01', description: 'Test', type: 'API' }),
    } as APIGatewayProxyEvent;

    const response = await createEventLogHandler(event, {} as any, {} as any) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe('Enqueue error');
  });
});
