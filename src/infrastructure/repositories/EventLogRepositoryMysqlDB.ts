// src/infrastructure/repositories/EventLogRepositoryMysqlDB.ts
import { EventLogRepository } from '../../domain/repository/EventLogRepository';
import { EventLog } from '../../domain/entity/EventLog';
import { IDatabaseClient } from '../database/IDatabaseClient';
import { EventLogMapper } from '../../application/mappers/EventLogMapper';

export class EventLogRepositoryMysqlDB implements EventLogRepository {
    private databaseClient: IDatabaseClient;
    private mapper: EventLogMapper;
    private tableName: string;

    constructor(databaseClient: IDatabaseClient, mapper: EventLogMapper) {
        this.databaseClient = databaseClient;
        this.mapper = mapper;
        this.tableName = 'EventLogs';
    }

    async find(startDate?: string, endDate?: string, type?: string): Promise<EventLog[]> {
        let query = `SELECT * FROM ${this.tableName} WHERE 1=1`;
        const parameters: any[] = [];

        if (startDate) {
            query += ' AND date >= :startDate';
            parameters.push({ name: 'startDate', value: { stringValue: startDate } });
        }
        if (endDate) {
            query += ' AND date <= :endDate';
            parameters.push({ name: 'endDate', value: { stringValue: endDate } });
        }
        if (type) {
            query += ' AND type = :type';
            parameters.push({ name: 'type', value: { stringValue: type } });
        }

        const result = await this.databaseClient.executeQuery(query, parameters);
        return this.mapper.mapRecordsToEventLogsFromDB(result.records);
    }

    async save(eventLog: EventLog): Promise<void> {
        const query = `INSERT INTO ${this.tableName} (date, description, type) VALUES (:date, :description, :type)`;
        const parameters = [
            { name: 'date', value: { stringValue: eventLog.date } },
            { name: 'description', value: { stringValue: eventLog.description } },
            { name: 'type', value: { stringValue: eventLog.type } },
        ];

        await this.databaseClient.executeQuery(query, parameters);
    }
}
