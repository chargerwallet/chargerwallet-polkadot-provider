import { Unsubcall, InjectedAccount } from '@polkadot/extension-inject/types';
import type { InjectedAccounts } from '@polkadot/extension-inject/types';
import { ProviderPolkadot } from '../ChargerwalletPolkadotProvider';
export default class implements InjectedAccounts {
    private provider;
    constructor(provider: ProviderPolkadot);
    get: (anyType?: boolean) => Promise<InjectedAccount[]>;
    subscribe: (cb: (accounts: InjectedAccount[]) => unknown) => Unsubcall;
    toJSON(): {
        get: {};
        subscribe: {};
    };
}
