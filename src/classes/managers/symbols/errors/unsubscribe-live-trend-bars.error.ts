import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class UnsubscribeLiveTrendBarsError extends cTraderXError {
    constructor(error: unknown) {
        super(
            `Unsubscribe live trend bars error: ${cTraderXError.getMessageError(error)}`,
        );
    }
}
