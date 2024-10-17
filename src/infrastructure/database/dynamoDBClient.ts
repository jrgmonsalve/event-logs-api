import { DynamoDB } from 'aws-sdk';

let dynamoDb: DynamoDB.DocumentClient;

export function getDynamoDBClient(): DynamoDB.DocumentClient {
  if (!dynamoDb) {
    dynamoDb = new DynamoDB.DocumentClient({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.DYNAMODB_ENDPOINT || undefined, // Configurable para ambientes locales o testing
    });
  }
  return dynamoDb;
}
