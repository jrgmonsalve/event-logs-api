import { EventLogRepository } from '../../domain/repository/EventLogRepository';
import { EventLog } from '../../domain/entity/EventLog';
import { RDSDataService } from 'aws-sdk';

export class EventLogRepositoryAuroraDB implements EventLogRepository {
  private rds: RDSDataService;
  private resourceArn: string;
  private secretArn: string;
  private database: string;
  private tableName: string;

  constructor() {
    this.rds = new RDSDataService();
    this.resourceArn = process.env.AURORA_RESOURCE_ARN || '';
    this.secretArn = process.env.AURORA_SECRET_ARN || '';
    this.database = process.env.AURORA_DB_NAME || 'myDatabase';
    this.tableName = 'EventLogs';
  }

  async findEventLogs(startDate?: string, endDate?: string, type?: string): Promise<EventLog[]> {
    let query = `SELECT * FROM ${this.tableName} WHERE 1=1`;
    const params: any = {};

    if (startDate) {
      query += ' AND date >= :startDate';
      params['startDate'] = startDate;
    }
    if (endDate) {
      query += ' AND date <= :endDate';
      params['endDate'] = endDate;
    }
    if (type) {
      query += ' AND type = :type';
      params['type'] = type;
    }

    const result = await this.rds.executeStatement({
      resourceArn: this.resourceArn,
      secretArn: this.secretArn,
      sql: query,
      parameters: Object.keys(params).map((key) => ({
        name: key,
        value: { stringValue: params[key] },
      })),
      database: this.database,
    }).promise();

    return result.records?.map((record) => {
        const date = record[0]?.stringValue;
        const description = record[1]?.stringValue;
        const type = record[2]?.stringValue;
  
        if (!date || !description || !type) {
          console.warn('Invalid record found, skipping');
          return null;
        }
  
        return new EventLog(date, description, type);
      }).filter(eventLog => eventLog !== null) || []; // TODO: try to use a mapper
  }

  async save(eventLog: EventLog): Promise<void> {
    const query = `INSERT INTO ${this.tableName} (date, description, type) VALUES (:date, :description, :type)`;
    await this.rds.executeStatement({
      resourceArn: this.resourceArn,
      secretArn: this.secretArn,
      sql: query,
      parameters: [
        { name: 'date', value: { stringValue: eventLog.date } },
        { name: 'description', value: { stringValue: eventLog.description } },
        { name: 'type', value: { stringValue: eventLog.type } },
      ],
      database: this.database,
    }).promise();
  }
}
