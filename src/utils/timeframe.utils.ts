export class TimeFrame {
    private static timeframesToMsConversionMap: Record<string, number> = {};

    /**
     * converts a time frame to milliseconds
     * @param timeFrame string in form of (s,m,h,d,w,M,y)
     * @returns number ms representation of given time frame
     */
    static parseTimeFrameToMs(timeFrame: string) {
        if (this.timeframesToMsConversionMap[timeFrame]) {
            return this.timeframesToMsConversionMap[timeFrame];
        }

        ////////////////////////////////////////////////////////
        // THIS IS NOT INTENDED TO BE USED AS THE HIMALAYA STD
        // TIMEFRAME FORMAT
        ////////////////////////////////////////////////////////
        const amount = +timeFrame.slice(1);
        const unit = timeFrame.slice(0, 1);
        ////////////////////////////////////////////////////////
        let scale: number;

        if (unit === 'Y') {
            scale = 60 * 60 * 24 * 365;
        } else if (unit === 'MN') {
            scale = 60 * 60 * 24 * 30;
        } else if (unit === 'W') {
            scale = 60 * 60 * 24 * 7;
        } else if (unit === 'D') {
            scale = 60 * 60 * 24;
        } else if (unit === 'H') {
            scale = 60 * 60;
        } else if (unit === 'M') {
            scale = 60;
        } else if (unit === 'S') {
            scale = 1;
        } else {
            throw Error('time frame unit ' + unit + ' is not supported');
        }

        this.timeframesToMsConversionMap[timeFrame] = amount * scale * 1000;
        return this.timeframesToMsConversionMap[timeFrame];
    }

    static roundToTimeFrame(timestamp: number, timeframe: string): number {
        const timeframeInMs = this.parseTimeFrameToMs(timeframe);
        const floored = Math.floor(timestamp / timeframeInMs) * timeframeInMs;
        return floored;
    }
}
