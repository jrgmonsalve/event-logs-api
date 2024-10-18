export class ValidationErrorException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class QueueErrorException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'QueueError';
    }
}
