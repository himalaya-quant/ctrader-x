import { cTraderXError } from '../../models/ctrader-x-error.model';
import { ILogger } from '../../logger';
import { CTraderConnection } from '@reiryoku/ctrader-layer';
import { ICredentials } from './credentials.model';
import { ProtoOAErrorRes } from '../../../models/proto/models/ProtoOAErrorRes';

export abstract class BaseManager {
    protected readonly logger: ILogger;
    protected readonly credentials: ICredentials;
    protected readonly connection: CTraderConnection;

    protected logCallAttempt(method: Function, extra?: Record<string, any>) {
        if (extra) {
            this.logger.debug(
                `Attempting ${method.name} call: ${JSON.stringify(extra)}`,
            );
        } else {
            this.logger.debug(`Attempting ${method.name} call`);
        }
    }

    protected logCallAttemptSuccess(
        method: Function,
        extra?: Record<string, any>,
    ) {
        if (extra) {
            this.logger.debug(
                `Call attempt to ${method.name} succeeded: ${JSON.stringify(extra)}`,
            );
        } else {
            this.logger.debug(`Call attempt to ${method.name} succeeded`);
        }
    }

    protected logCallAttemptFailure(method: Function, error: unknown) {
        this.logger.error(
            `Call attempt to ${method.name} failed: ${cTraderXError.getMessageError(error)}`,
        );
    }

    protected handleCTraderCallError(
        error: ProtoOAErrorRes,
        method: Function,
        rethrowError: cTraderXError,
    ): cTraderXError {
        const message = cTraderXError.getMessageError(error);
        this.logCallAttemptFailure(method, message);
        return rethrowError;
    }
}
