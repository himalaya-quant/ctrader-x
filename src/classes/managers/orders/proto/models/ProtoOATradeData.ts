import { BaseProto } from '../../../../../models/proto/base-proto';
import { ProtoOATradeSide } from '../enums/ProtoOATradeSide';

export class ProtoOATradeData extends BaseProto {
    /**
     * The unique identifier of the symbol in specific server environment within cTrader platform. Different brokers might have different IDs.
     */
    symbolId: number;

    /**
     * Volume in cents (e.g. 1000 in protocol means 10.00 units).
     */
    volume: number;

    /**
     * Buy, Sell.
     * The keys of the enum ProtoOATradeSide.
     *
     * cTrader wants the numeric value
     * of the enum when sending the order, but replies with the enum key when
     * emitting events
     */
    tradeSide: keyof ProtoOATradeSide;

    /**
     * The Unix time in milliseconds when position was opened or order was created.
     */
    openTimestamp?: number;

    /**
     * Text label specified during order request.
     */
    label?: string;

    /**
     * If TRUE then position/order stop loss is guaranteedStopLoss.
     */
    guaranteedStopLoss?: boolean;

    /**
     * User-specified comment.
     */
    comment?: string;

    /**
     * Specifies the units in which the Symbol is denominated.
     */
    measurementUnits?: string;

    /**
     * The Unix time in milliseconds when a Position was closed
     */
    closeTimestamp?: number;
}
