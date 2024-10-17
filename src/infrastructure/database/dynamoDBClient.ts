import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';

let dynamoDb: DynamoDBDocument;

export function getDynamoDBClient(): DynamoDBDocument {
  if (!dynamoDb) {
    dynamoDb = DynamoDBDocument.from(new DynamoDB({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.DYNAMODB_ENDPOINT || undefined, // Configurable para ambientes locales o testing
    }));
  }
  return dynamoDb;
}
