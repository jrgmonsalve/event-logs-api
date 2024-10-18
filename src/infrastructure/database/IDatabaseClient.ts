export interface IDatabaseClient {
    executeQuery(query: string, parameters: any[]): Promise<any>;
}
