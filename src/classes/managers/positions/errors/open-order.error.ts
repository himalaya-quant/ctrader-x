import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class OpenOrderError extends cTraderXError {
    constructor(error: unknown) {
        super(`Open order error: ${cTraderXError.getMessageError(error)}`);
    }
}
