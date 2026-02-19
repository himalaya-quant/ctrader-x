import * as dotenv from 'dotenv';
import * as process from 'node:process';

dotenv.config({ override: true });

export class Config {
    static get SPOTWARE_CTID_TRADER_ACCOUNT_ID() {
        this.ensureConfigExistenceOrThrow(
            'CTRADERX_SPOTWARE_CTID_TRADER_ACCOUNT_ID',
        );
        const value = this.getConfig(
            'CTRADERX_SPOTWARE_CTID_TRADER_ACCOUNT_ID',
        );
        if (!!value && !isNaN(+value)) return +value;
        throw new Error(
            `Invalid CTRADERX_SPOTWARE_CTID_TRADER_ACCOUNT_ID. Should be a number`,
        );
    }

    static get SPOTWARE_ACCESS_TOKEN() {
        this.ensureConfigExistenceOrThrow('CTRADERX_SPOTWARE_ACCESS_TOKEN');
        return this.getConfig('CTRADERX_SPOTWARE_ACCESS_TOKEN');
    }

    static get SPOTWARE_CLIENT_SECRET() {
        this.ensureConfigExistenceOrThrow('CTRADERX_SPOTWARE_CLIENT_SECRET');
        return this.getConfig('CTRADERX_SPOTWARE_CLIENT_SECRET');
    }

    static get SPOTWARE_CLIENT_ID() {
        this.ensureConfigExistenceOrThrow('CTRADERX_SPOTWARE_CLIENT_ID');
        return this.getConfig('CTRADERX_SPOTWARE_CLIENT_ID');
    }

    static get DEBUG_LOGS() {
        this.ensureConfigExistenceOrThrow('CTRADERX_DEBUG_LOGS');
        return this.getConfig('CTRADERX_DEBUG_LOGS') === 'true';
    }

    private static ensureConfigExistenceOrThrow(config: string): void {
        if (!process.env[config])
            throw new Error(`Missing env config ${config}. Please provide it`);
    }

    private static getConfig(config: string): string {
        return process.env[config]!;
    }
}
