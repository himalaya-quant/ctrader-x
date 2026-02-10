import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class GetSymbolsDetailsError extends cTraderXError {
    constructor(error: unknown) {
        super(
            `Get symbols details error: ${cTraderXError.getMessageError(error)}`,
        );
    }
}
