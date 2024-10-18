export class EventLogNotFoundException extends Error {
    constructor(message: string = 'EventLog not found') {
        super(message);
        this.name = 'EventLogNotFoundException';
    }
}
export class EventLogDataInvalidException extends Error {
    constructor(message: string = 'EventLog invalid data') {
        super(message);
        this.name = 'EventLogDataInvalidException';
    }
}
