import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class CancelPendingOrderError extends cTraderXError {
    constructor(error: unknown) {
        super(
            `Cancel pending order error: ${cTraderXError.getMessageError(error)}`,
        );
    }
}
