// src/shared/ErrorHandler.ts
import { APIGatewayProxyResult } from 'aws-lambda';
import { ResponseBuilder } from './ResponseBuilder';
import { QueueErrorException, ValidationErrorException } from './CustomExceptions';

export const handleError = (error: any): APIGatewayProxyResult => {
  if (error instanceof ValidationErrorException) {
    return ResponseBuilder.error(error.message, 400);
  }
  if (error instanceof QueueErrorException) {
    console.error(error);
    return ResponseBuilder.error('Failed to enqueue event log', 500);
  }
  console.error(error);
  return ResponseBuilder.error('An unexpected error occurred', 500);
};
