import { SQS } from 'aws-sdk';
import { QueueRepository } from '../../domain/repository/QueueRepository';

export class QueueRepositorySQS implements QueueRepository {
  private sqs: SQS;
  private queueUrl: string;

  constructor() {
    this.sqs = new SQS();
    this.queueUrl = process.env.SQS_QUEUE_URL || ''; 
  }

  async sendMessage(message: any): Promise<void> {
    const params = {
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(message),
    };

    await this.sqs.sendMessage(params).promise();
  }
}
