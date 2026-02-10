import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class GetSymbolsListError extends cTraderXError {
    constructor(message: string) {
        super(`Get symbols list error: ${message}`);
    }
}
