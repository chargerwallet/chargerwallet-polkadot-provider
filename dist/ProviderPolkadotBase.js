import { IInjectedProviderNames } from '@chargerwallet/cross-inpage-provider-types';
import { ProviderBase } from '@chargerwallet/cross-inpage-provider-core';
class ProviderPolkadotBase extends ProviderBase {
    constructor(props) {
        super(props);
        this.providerName = IInjectedProviderNames.polkadot;
    }
    request(data) {
        return this.bridgeRequest(data);
    }
}
export { ProviderPolkadotBase };
