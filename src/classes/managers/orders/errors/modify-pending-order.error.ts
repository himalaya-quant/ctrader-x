import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class ModifyPendingOrderError extends cTraderXError {
    constructor(error: unknown) {
        super(
            `Modify pending order error: ${cTraderXError.getMessageError(error)}`,
        );
    }
}
