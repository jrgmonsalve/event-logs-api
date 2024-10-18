import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EventLogService } from '../../application/services/EventLogService';
import { ResponseBuilder } from '../../shared/ResponseBuilder';
import { EventLogMapper } from '../mappers/EventLogMapper';
import { getEventLogRepository } from '../../infrastructure/repositories/EventLogRepositoryFactory';

export const listEventLogsHandler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    try {
        const eventLogRepository = getEventLogRepository();
        const eventLogService = new EventLogService(eventLogRepository);

        const queryParams = event.queryStringParameters || {};
        const eventLogs = await eventLogService.getEventLogs(queryParams);
        return ResponseBuilder.success(eventLogs);
    } catch (error) {
        return ResponseBuilder.error(error);
    }
};
