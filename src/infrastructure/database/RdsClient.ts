import { RDSDataClient, ExecuteStatementCommand } from '@aws-sdk/client-rds-data';
import { IDatabaseClient } from './IDatabaseClient';

export class RdsClient implements IDatabaseClient {
    private rdsClient: RDSDataClient;
    private resourceArn: string;
    private secretArn: string;
    private database: string;

    constructor(resourceArn: string, secretArn: string, database: string) {
        this.rdsClient = new RDSDataClient({});
        this.resourceArn = resourceArn;
        this.secretArn = secretArn;
        this.database = database;
    }

    async executeQuery(query: string, parameters: any[]): Promise<any> {
        const command = new ExecuteStatementCommand({
            resourceArn: this.resourceArn,
            secretArn: this.secretArn,
            sql: query,
            parameters,
            database: this.database,
        });

        return this.rdsClient.send(command);
    }
}
