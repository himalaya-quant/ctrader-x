import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class GetOpenPositionsError extends cTraderXError {
    constructor(error: unknown) {
        super(
            `Get open positions error: ${cTraderXError.getMessageError(error)}`,
        );
    }
}
