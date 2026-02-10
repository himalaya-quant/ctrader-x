import { BaseProto } from '../base-proto';

/**
 * Holiday period when trading is not available.
 */
export class ProtoOAHoliday extends BaseProto {
    /**
     * Holiday unique ID.
     */
    holidayId: number;

    /**
     * Name of the holiday.
     */
    name: string;

    /**
     * Description of the holiday.
     */
    description?: string;

    /**
     * Start timestamp of the holiday in milliseconds.
     */
    startTimestamp: number;

    /**
     * End timestamp of the holiday in milliseconds.
     */
    endTimestamp: number;
}
