import { QueueRepository } from '../../domain/repository/QueueRepository';

export class QueueService {
  private queueRepository: QueueRepository;

  constructor(queueRepository: QueueRepository) {
    this.queueRepository = queueRepository;
  }

  async enqueueEventLog(eventLog: any): Promise<void> {
    await this.queueRepository.sendMessage(eventLog);
  }
}
