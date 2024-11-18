import { ProviderPolkadot } from '../ChargerwalletPolkadotProvider';
import Signer from './Signer';
import type { Injected, InjectedMetadata, InjectedProvider } from '@polkadot/extension-inject/types';
import Accounts from './Accounts';
export default class implements Injected {
    readonly accounts: Accounts;
    readonly metadata: InjectedMetadata | undefined;
    readonly provider: InjectedProvider | undefined;
    readonly signer: Signer;
    constructor(provider: ProviderPolkadot);
    toJSON(): {
        accounts: Accounts;
        metadata: InjectedMetadata | undefined;
        provider: InjectedProvider | undefined;
        signer: Signer;
    };
}
