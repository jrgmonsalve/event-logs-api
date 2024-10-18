// src/infrastructure/repositories/EventLogRepositoryDynamoDB.ts
import { DynamoDBDocument, NativeAttributeValue, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { EventLogRepository } from '../../domain/repository/EventLogRepository';
import { EventLog } from '../../domain/entity/EventLog';
import { getDynamoDBClient } from '../database/dynamoDBClient';

export class EventLogRepositoryDynamoDB implements EventLogRepository {
  private dynamoDb: DynamoDBDocument;
  private tableName = process.env.DYNAMODB_TABLE_NAME || 'EventLogs';

  constructor() {
    this.dynamoDb = getDynamoDBClient();
  }

  async find(
    startDate?: string,
    endDate?: string,
    type?: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ data: EventLog[]; total: number }> {
    const params: ScanCommandInput = {
      TableName: this.tableName,
      FilterExpression: undefined,
      ExpressionAttributeValues: {} as Record<string, NativeAttributeValue>,
      Limit: pageSize,
      ExclusiveStartKey: undefined,
    };

    const filterExpressions: string[] = [];

    if (type) {
      filterExpressions.push('type = :type');
      params.ExpressionAttributeValues![':type'] = type;
    }

    if (startDate && endDate) {
      filterExpressions.push('date BETWEEN :startDate AND :endDate');
      params.ExpressionAttributeValues![':startDate'] = startDate;
      params.ExpressionAttributeValues![':endDate'] = endDate;
    } else if (startDate) {
      filterExpressions.push('date >= :startDate');
      params.ExpressionAttributeValues![':startDate'] = startDate;
    } else if (endDate) {
      filterExpressions.push('date <= :endDate');
      params.ExpressionAttributeValues![':endDate'] = endDate;
    }

    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND ');
    } else {
      delete params.FilterExpression;
      delete params.ExpressionAttributeValues;
    }

    let items: EventLog[] = [];
    let lastEvaluatedKey;
    let currentPage = 1;

    do {
      if (lastEvaluatedKey) {
        params.ExclusiveStartKey = lastEvaluatedKey;
      }

      const result = await this.dynamoDb.scan(params);

      if (currentPage === page) {
        items = result.Items?.map((item) => new EventLog(item.date, item.description, item.type)) || [];
      }

      lastEvaluatedKey = result.LastEvaluatedKey;
      currentPage++;
    } while (lastEvaluatedKey && currentPage <= page);

    // Obtener el total de elementos
    const totalResult = await this.dynamoDb.scan({
      TableName: this.tableName,
      Select: 'COUNT',
      FilterExpression: params.FilterExpression,
      ExpressionAttributeValues: params.ExpressionAttributeValues,
    });

    const total = totalResult.Count || 0;

    return { data: items, total };
  }

  async save(eventLog: EventLog): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        date: eventLog.date,
        description: eventLog.description,
        type: eventLog.type,
      },
    };

    await this.dynamoDb.put(params);
  }
}
