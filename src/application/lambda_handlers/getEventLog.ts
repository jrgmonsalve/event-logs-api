import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EventLogService } from '../../application/services/EventLogService';
import { ResponseBuilder } from '../../shared/ResponseBuilder';
import { getEventLogRepository } from '../../infrastructure/repositories/EventLogRepositoryFactory';
import { PaginatedEventLogDTO } from '../../domain/dto/PaginatedEventLogDTO';

export const listEventLogsHandler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    try {
        const eventLogRepository = getEventLogRepository();
        const eventLogService = new EventLogService(eventLogRepository);

        const queryParams = event.queryStringParameters || {};
        const paginatedResponse: PaginatedEventLogDTO = await eventLogService.getEventLogs(queryParams);
        
        const currentPath = event.requestContext.path;
        const baseUrl = `https://${event.requestContext.domainName}${currentPath}`;
        paginatedResponse.next_page_url = paginatedResponse.next_page_url ? `${baseUrl}${paginatedResponse.next_page_url}` : null;
        paginatedResponse.prev_page_url = paginatedResponse.prev_page_url ? `${baseUrl}${paginatedResponse.prev_page_url}` : null;
        paginatedResponse.first_page_url = `${baseUrl}${paginatedResponse.first_page_url}`;

        return ResponseBuilder.success(paginatedResponse);
    } catch (error) {
        return ResponseBuilder.error(error);
    }
};
