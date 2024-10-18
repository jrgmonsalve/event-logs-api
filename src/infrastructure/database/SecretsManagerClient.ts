import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export async function getDatabaseCredentials(secretArn: string) {
    const client = new SecretsManagerClient({});
    const command = new GetSecretValueCommand({ SecretId: secretArn });
    const response = await client.send(command);

    if (!response.SecretString) {
        throw new Error('SecretString is empty');
    }

    return JSON.parse(response.SecretString);
}
