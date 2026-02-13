export class TrendBarUtils {
    static getPriceFromRelative(digits: number, relative: number): number {
        return (
            Math.round((relative / 100000.0) * Math.pow(10, digits)) /
            Math.pow(10, digits)
        );
    }
}
