import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class GetTrendBarsError extends cTraderXError {
    constructor(readonly error: unknown) {
        super(`Get trend bars error: ${cTraderXError.getMessageError(error)}`);
    }
}
