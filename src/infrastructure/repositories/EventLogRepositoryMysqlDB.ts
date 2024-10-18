// src/infrastructure/repositories/EventLogRepositoryMysqlDB.ts
import { EventLogRepository } from '../../domain/repository/EventLogRepository';
import { EventLog } from '../../domain/entity/EventLog';
import * as mysql from 'mysql2/promise';
import { getDatabaseCredentials } from '../database/SecretsManagerClient';

export class EventLogRepositoryMysqlDB implements EventLogRepository {
    private tableName: string;
    private secretArn: string;

    constructor() {
        this.tableName = 'EventLogs';
        this.secretArn = process.env.DB_SECRET_ARN || '';
    }

    private async getConnection() {
        const credentials = await getDatabaseCredentials(this.secretArn);
        return mysql.createConnection({
            host: credentials.host,
            user: credentials.username,
            password: credentials.password,
            database: credentials.dbname,
        });
    }

    async find(
        startDate?: string,
        endDate?: string,
        type?: string,
        page: number = 1,
        pageSize: number = 10
    ): Promise<{ data: EventLog[]; total: number }> {
        const offset = (page - 1) * pageSize;
        const queryParams: any[] = [];
        let query = `SELECT * FROM ${this.tableName} WHERE 1=1`;

        if (startDate) {
            query += ' AND date >= ?';
            queryParams.push(startDate);
        }
        if (endDate) {
            query += ' AND date <= ?';
            queryParams.push(endDate);
        }
        if (type) {
            query += ' AND type = ?';
            queryParams.push(type);
        }

        query += ' LIMIT ? OFFSET ?';
        queryParams.push(pageSize, offset);

        const connection = await this.getConnection();
        const [rows] = await connection.execute(query, queryParams);

        // Obtener el total de registros
        const countQuery = `SELECT COUNT(*) as total FROM ${this.tableName}`;
        const [countRows]: any = await connection.execute(countQuery);
        const total = countRows[0].total;

        const data = (rows as any[]).map(row => new EventLog(row.description, row.type, row.date));
        await connection.end();

        return { data, total };
    }

    async save(eventLog: EventLog): Promise<void> {
        const query = `INSERT INTO ${this.tableName} (date, description, type) VALUES (?, ?, ?)`;
        const queryParams = [eventLog.date, eventLog.description, eventLog.type];

        const connection = await this.getConnection();
        await connection.execute(query, queryParams);
        await connection.end();
    }
}
