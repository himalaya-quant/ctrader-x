import { BaseProto } from '../../../../../models/proto/base-proto';
import { ProtoOATrendbar } from './ProtoOATrendbar';

export class ProtoOASpotEvent extends BaseProto {
    symbolId: number;

    /**
     * Returns live trend bar. Requires subscription on the trend bars.
     */
    trendbar: ProtoOATrendbar[];

    /**
     * Bid price. Specified in 1/100000 of unit of a price. (e.g. 123000 in protocol means 1.23, 53423782 means 534.23782)
     */
    bid?: number;

    /**
     * Ask price. Specified in 1/100000 of unit of a price. (e.g. 123000 in protocol means 1.23, 53423782 means 534.23782)
     */
    ask?: number;

    /**
     * The Unix time for spot.
     */
    timestamp?: number;

    /**
     * Last session close. Specified in 1/100000 of unit of a price. (e.g. 123000 in protocol means 1.23, 53423782 means 534.23782)
     */
    sessionClose?: number;
}
