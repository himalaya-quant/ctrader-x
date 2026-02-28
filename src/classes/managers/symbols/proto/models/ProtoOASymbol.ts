import { BaseProto } from '../../../../../models/proto/base-proto';
import { ProtoOAHoliday } from './ProtoOAHoliday';
import { ProtoOAInterval } from './ProtoOAInterval';

/**
 * Symbol entity with the full set of fields.
 */
export class ProtoOASymbol extends BaseProto {
    /**
     * The unique identifier of the symbol in specific server environment within cTrader platform.
     * Different servers have different IDs.
     */
    symbolId: number;

    /**
     * Number of price digits to be displayed.
     */
    digits: number;

    /**
     * Pip position on digits.
     */
    pipPosition: number;

    /**
     * If TRUE then the short selling with the symbol is enabled.
     */
    enableShortSelling?: boolean;

    /**
     * If TRUE then setting of guaranteedStopLoss is available for limited risk accounts.
     */
    guaranteedStopLoss?: boolean;

    /**
     * Day of the week when SWAP charge amount will be tripled. Doesn't impact Rollover Commission.
     * Default: MONDAY
     */
    swapRollover3Days?:
        | 'MONDAY'
        | 'TUESDAY'
        | 'WEDNESDAY'
        | 'THURSDAY'
        | 'FRIDAY'
        | 'SATURDAY'
        | 'SUNDAY';

    /**
     * SWAP charge for long positions.
     */
    swapLong?: number;

    /**
     * SWAP charge for short positions.
     */
    swapShort?: number;

    /**
     * Maximum allowed volume in cents for an order with a symbol.
     */
    maxVolume?: number;

    /**
     * Minimum allowed volume in cents for an order with a symbol.
     */
    minVolume?: number;

    /**
     * Step of the volume in cents for an order with a symbol.
     */
    stepVolume?: number;

    /**
     * Maximum allowed exposure for the symbol (in cents).
     */
    maxExposure?: number;

    /**
     * Array of trading intervals (periods) available for the symbol.
     */
    schedule?: ProtoOAInterval[];

    /**
     * Commission base amount. Measured in 1/100000 of currency unit.
     * @deprecated Use preciseTradingCommissionRate instead
     */
    commission?: number;

    /**
     * Commission type.
     */
    commissionType?:
        | 'USD_PER_MIL_USD'
        | 'USD_PER_LOT'
        | 'PERCENTAGE'
        | 'QUOTE_CCY_PER_LOT';

    /**
     * Minimum commission amount. Measured in 1/100000 of currency unit.
     * @deprecated Use preciseMinCommission instead
     */
    minCommission?: number;

    /**
     * Minimum commission type.
     */
    minCommissionType?: 'CURRENCY' | 'QUOTE_CURRENCY';

    /**
     * Currency in which the minimum commission is specified.
     */
    minCommissionAsset?: string;

    /**
     * Rollover commission amount. Measured in 1/100000 of currency unit.
     */
    rolloverCommission?: number;

    /**
     * Day of the week when rollover commission will be charged three times.
     */
    rolloverCommission3Days?:
        | 'MONDAY'
        | 'TUESDAY'
        | 'WEDNESDAY'
        | 'THURSDAY'
        | 'FRIDAY'
        | 'SATURDAY'
        | 'SUNDAY';

    /**
     * If TRUE then SWAP charges will be applied on weekends.
     */
    chargeSwapAtWeekends?: boolean;

    /**
     * Lot size of the symbol (volume in cents).
     */
    lotSize?: number;

    /**
     * Distance type for setting SL/TP.
     */
    distanceSetIn?: 'PIPS' | 'POINTS' | 'SYMBOL_DIGITS';

    /**
     * Minimum distance for setting Stop Loss in specified units.
     */
    slDistance?: number;

    /**
     * Minimum distance for setting Take Profit in specified units.
     */
    tpDistance?: number;

    /**
     * Minimum distance for setting Guaranteed Stop Loss in specified units.
     */
    gslDistance?: number;

    /**
     * Guaranteed Stop Loss charge. Measured in 1/100000 of currency unit.
     */
    gslCharge?: number;

    /**
     * Type of distance unit for setting guaranteed stop loss.
     */
    gslDistanceType?: 'PIPS' | 'POINTS' | 'SYMBOL_DIGITS';

    /**
     * Symbol description.
     */
    description?: string;

    /**
     * Number of consecutive days (holidays) when SWAP is skipped.
     */
    skipRolloverDays?: number;

    /**
     * Time zone for the symbol's schedule.
     */
    scheduleTimeZone?: string;

    /**
     * Precise trading commission rate. Measured in 1/100000000 of currency unit.
     */
    preciseTradingCommissionRate?: number;

    /**
     * Precise minimum commission. Measured in 1/100000000 of currency unit.
     */
    preciseMinCommission?: number;

    /**
     * Array of holiday periods when trading is not available.
     */
    holiday?: ProtoOAHoliday[];

    /**
     * Conversion fee rate for P&L. Measured in 1/100000000.
     */
    pnlConversionFeeRate?: number;

    /**
     * ID referencing a dynamic leverage entity.
     */
    leverageId?: number;

    /**
     * Number of SWAP periods to skip.
     */
    skipSWAPPeriods?: number;

    /**
     * Measurement units for the symbol (e.g., "oz" for gold).
     */
    measurementUnits?: string;
}
