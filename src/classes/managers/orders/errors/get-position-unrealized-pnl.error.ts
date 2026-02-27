import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class GetPositionUnrealizedPnLError extends cTraderXError {
    constructor(error: unknown) {
        super(`Get position unrealized PnL error: ${cTraderXError.getMessageError(error)}`);
    }
}
