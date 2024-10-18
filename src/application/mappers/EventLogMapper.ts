import { EventLog } from '../../domain/entity/EventLog';
import { EventTypeEnum } from '../../domain/enums/EventTypeEnum';
import { ValidationErrorException } from '../../shared/CustomExceptions';

export class EventLogMapper {
    mapRecordsToEventLogsFromDB(records: any[] | undefined): EventLog[] {
        if (!records) {
            return [];
        }

        return records
            .map((record) => {
                const date = record[0]?.stringValue;
                const description = record[1]?.stringValue;
                const type = record[2]?.stringValue;

                if (!date || !description || !type) {
                    console.warn('Invalid record found, skipping');
                    return null;
                }

                return new EventLog(description, type as EventTypeEnum, date);
            })
            .filter((eventLog): eventLog is EventLog => eventLog !== null);
    }
    mapToEventLog(data: any): EventLog {
        if (!data.description || !data.eventType) {
            throw new ValidationErrorException('Missing required fields: description or eventType');
        }
        return new EventLog(data.description, data.eventType as EventTypeEnum, data?.date);
    }
}
