// src/domain/entity/EventLog.ts
import { EventTypeEnum } from '../enums/EventTypeEnum';
import { EventLogDataInvalidException } from '../exceptions/EventLogNotFoundException';

export class EventLog {
    public date: string;
    public description: string;
    public type: EventTypeEnum;

    constructor(
        description: string,
        eventType: EventTypeEnum,
        date?: string
    ) {
        // Validar que description y eventType sean obligatorios
        if (!description) {
            throw new EventLogDataInvalidException('Description is required');
        }
        if (!eventType) {
            throw new EventLogDataInvalidException('EventType is required');
        }
        if (!Object.values(EventTypeEnum).includes(eventType)) {
            throw new EventLogDataInvalidException(`Invalid eventType: ${eventType}. Allowed values are ${Object.values(EventTypeEnum).join(', ')}`);
        }

        this.description = description;
        this.type = eventType;
        this.date = date ?? new Date().toISOString();
    }
}
