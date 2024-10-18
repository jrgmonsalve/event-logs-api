import * as Joi from 'joi';
import { ValidationErrorException } from './CustomExceptions';
import { EventTypeEnum } from '../domain/enums/EventTypeEnum';

const createEventLogSchema = Joi.object({
    description: Joi.string().max(1000).required(),
    eventType: Joi.string().valid(EventTypeEnum.API, EventTypeEnum.FORM).required(),
}).strict(); 

export const validatePayloadCreateEventLog = (data: any): void => {
    const { error } = createEventLogSchema.validate(data, { abortEarly: false });
    if (error) {
        throw new ValidationErrorException(`Invalid request data: ${error.details.map(detail => detail.message).join(', ')}`);
    }
};
