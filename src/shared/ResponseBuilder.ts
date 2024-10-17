export class ResponseBuilder {
    static success(data: any, statusCode: number = 200) {
        return {
            statusCode,
            body: JSON.stringify(data),
        };
    }

    static error(error: any, statusCode: number = 500) {
        console.log(error);
        return {
            statusCode,
            body: JSON.stringify({ message: error.message || 'Internal Server Error' }),
        };
    }
}
