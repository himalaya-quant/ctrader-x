import { CTraderConnection } from '@reiryoku/ctrader-layer';
import { ILogger } from '../../logger';
import { ApplicationAuthenticationError } from './errors/application-auth.error';
import { cTraderXError } from '../../models/ctrader-x-error.model';
import { UserAuthenticationError } from './errors/user-auth.error';
import { ProtoOAAccountAuthReq } from '../../../models/proto/messages/authentication/ProtoOAAccountAuthReq';
import { ProtoOAApplicationAuthReq } from '../../../models/proto/messages/authentication/ProtoOAApplicationAuthReq';
import { ICredentials } from '../models/credentials.model';
import { BaseManager } from '../models/base.manager';

export class AuthenticationManager extends BaseManager {
    constructor(
        readonly credentials: ICredentials,
        private readonly connection: CTraderConnection,
        protected readonly logger: ILogger,
    ) {
        super();
    }

    async authenticateApp() {
        try {
            this.logCallAttempt(this.authenticateApp);

            const payload: ProtoOAApplicationAuthReq = {
                clientId: this.credentials.clientId,
                clientSecret: this.credentials.clientSecret,
            };
            await this.connection.sendCommand(
                ProtoOAApplicationAuthReq.name,
                payload,
            );

            this.logCallAttemptSuccess(this.authenticateApp);
        } catch (e) {
            const message = cTraderXError.getMessageError(e);
            this.logCallAttemptFailure(this.authenticateApp, message);
            throw new ApplicationAuthenticationError(message);
        }
    }

    async authenticateUser() {
        try {
            this.logCallAttempt(this.authenticateUser);

            const payload: ProtoOAAccountAuthReq = {
                accessToken: this.credentials.accessToken,
                ctidTraderAccountId: this.credentials.ctidTraderAccountId,
            };
            await this.connection.sendCommand(
                ProtoOAAccountAuthReq.name,
                payload,
            );

            this.logCallAttemptSuccess(this.authenticateUser);
        } catch (e) {
            const message = cTraderXError.getMessageError(e);
            this.logCallAttemptFailure(this.authenticateUser, message);
            throw new UserAuthenticationError(message);
        }
    }
}
