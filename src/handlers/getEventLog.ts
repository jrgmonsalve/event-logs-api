import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EventLogService } from '../application/services/EventLogService';
import { ResponseBuilder } from '../shared/ResponseBuilder';

const eventLogService = new EventLogService();

export const listEventLogsHandler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    try {
        const queryParams = event.queryStringParameters || {};
        const eventLogs = await eventLogService.getEventLogs(queryParams);
        return ResponseBuilder.success(eventLogs);
    } catch (error) {
        return ResponseBuilder.error(error);
    }
};
