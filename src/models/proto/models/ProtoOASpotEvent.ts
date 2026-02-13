import { BaseProto } from '../base-proto';
import { ProtoOATrendbar } from './ProtoOATrendbar';

export class ProtoOASpotEvent extends BaseProto {
    symbolId: number;
    trendbar: ProtoOATrendbar[];

    /**
     * Bid price. Specified in 1/100000 of unit of a price. (e.g. 123000 in protocol means 1.23, 53423782 means 534.23782)
     */
    bid?: number;

    /**
     * Ask price. Specified in 1/100000 of unit of a price. (e.g. 123000 in protocol means 1.23, 53423782 means 534.23782)
     */
    ask?: number;
    
    timestamp?: number;
    sessionClose?: number;
}
