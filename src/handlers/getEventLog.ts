import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EventLogService } from '../application/services/EventLogService';
import { ResponseBuilder } from '../shared/ResponseBuilder';
import { EventLogRepositoryAuroraDB } from '../infrastructure/repositories/EventLogRepositoryAuroraDB';
import { EventLogRepositoryDynamoDB } from '../infrastructure/repositories/EventLogRepositoryDynamoDB';

export const listEventLogsHandler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    try {
        const databaseType = process.env.DATABASE_TYPE || 'DynamoDB';
        let eventLogRepository;

        if (databaseType === 'Aurora') {
            eventLogRepository = new EventLogRepositoryAuroraDB();
        } else {
            eventLogRepository = new EventLogRepositoryDynamoDB();
        }

        const eventLogService = new EventLogService(eventLogRepository);
        const queryParams = event.queryStringParameters || {};
        const eventLogs = await eventLogService.getEventLogs(queryParams);
        return ResponseBuilder.success(eventLogs);
    } catch (error) {
        return ResponseBuilder.error(error);
    }
};
