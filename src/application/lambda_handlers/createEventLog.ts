import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { QueueRepositorySQS } from '../../infrastructure/repositories/QueueRepositorySQS';
import { QueueService } from '../../application/services/QueueService';
import { ResponseBuilder } from '../../shared/ResponseBuilder';
import { validatePayloadCreateEventLog } from '../../shared/RequestValidators';
import { handleError } from '../../shared/ErrorHandler';

export const createEventLogHandler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    try {
        
        const queueRepository = new QueueRepositorySQS();
        const queueService = new QueueService(queueRepository);

        const body = getBody(event);

        validatePayloadCreateEventLog(body);
        
        
        await queueService.enqueueEventLog(body);

        return ResponseBuilder.success({ message: 'EventLog request enqueued' }, 202);
    } catch (error) {
        return handleError(error);
    }
};

const getBody = (data: APIGatewayProxyEvent) => {
    return JSON.parse(data.body || '{}');
}