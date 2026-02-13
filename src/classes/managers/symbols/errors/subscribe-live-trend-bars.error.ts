import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class SubscribeLiveTrendBarsError extends cTraderXError {
    constructor(error: unknown) {
        super(
            `Subscribe live trend bars error: ${cTraderXError.getMessageError(error)}`,
        );
    }
}

export class SubscribeLiveTrendBarsInternalError extends cTraderXError {
    constructor(error: unknown) {
        super(
            `[INTERNAL] Subscribe live trend bars error: ${cTraderXError.getMessageError(error)}`,
        );
    }
}
