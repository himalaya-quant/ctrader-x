import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class ClosePositionError extends cTraderXError {
    constructor(error: unknown) {
        super(`Close position error: ${cTraderXError.getMessageError(error)}`);
    }
}
