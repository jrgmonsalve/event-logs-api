export class EventLogNotFoundException extends Error {
    constructor(message: string = 'EventLog not found') {
      super(message);
      this.name = 'EventLogNotFoundException';
    }
  }
  