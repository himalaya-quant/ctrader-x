import { CTraderConnection } from '@reiryoku/ctrader-layer';

import { ILogger } from '../../logger';
import { BaseManager } from '../models/base.manager';
import { ICredentials } from '../models/credentials.model';
import { UserAuthenticationError } from './errors/user-auth.error';
import { ApplicationAuthenticationError } from './errors/application-auth.error';
import { ProtoOAAccountAuthReq } from '../../../models/proto/messages/authentication/ProtoOAAccountAuthReq';
import { ProtoOAApplicationAuthReq } from '../../../models/proto/messages/authentication/ProtoOAApplicationAuthReq';

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
            throw this.handleCTraderCallError(
                e,
                this.authenticateApp,
                new ApplicationAuthenticationError(e),
            );
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
            throw this.handleCTraderCallError(
                e,
                this.authenticateUser,
                new UserAuthenticationError(e),
            );
        }
    }
}
