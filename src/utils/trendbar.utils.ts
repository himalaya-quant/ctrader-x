import { OHLCV } from '../models/common/ohlcv';
import { ProtoOATrendbar } from '../models/proto/models/ProtoOATrendbar';

export class TrendBarUtils {
    static getPriceFromRelative(digits: number, relative: number): number {
        return (
            Math.round((relative / 100000.0) * Math.pow(10, digits)) /
            Math.pow(10, digits)
        );
    }

    static mapTrendbarsToOHLCV(
        trendbars: ProtoOATrendbar[],
        precision: number,
    ) {
        // Initialize the output array, so the looping and re-assign by index will be
        // faster than mapping over the original array, or pushing in another one
        const output: OHLCV[] = new Array<OHLCV>(trendbars.length).fill(null!);

        for (let i = 0; i < trendbars.length; i++) {
            const trendbar = trendbars[i];

            const {
                low,
                volume,
                deltaClose,
                deltaHigh,
                deltaOpen,
                utcTimestampInMinutes,
            } = trendbar;

            const T = +utcTimestampInMinutes! * 60000;
            const O = TrendBarUtils.getPriceFromRelative(
                precision,
                +low! + +deltaOpen!,
            );
            const H = TrendBarUtils.getPriceFromRelative(
                precision,
                +low! + +deltaHigh!,
            );
            const L = TrendBarUtils.getPriceFromRelative(precision, +low!);
            // const C = TrendBarUtils.getPriceFromRelative(
            //     precision,
            //     +low! + +deltaClose!,
            // );
            const C =
                deltaClose !== undefined
                    ? TrendBarUtils.getPriceFromRelative(
                          precision,
                          +low! + +deltaClose,
                      )
                    : TrendBarUtils.getPriceFromRelative(precision, +low!);
            const V = +volume;
            output[i] = [T, O, H, L, C, V];
        }

        return output;
    }
}
