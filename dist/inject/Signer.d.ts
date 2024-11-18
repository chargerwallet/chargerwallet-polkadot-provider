import { ProviderPolkadot } from '../ChargerwalletPolkadotProvider';
import { SignerPayloadJSON, SignerPayloadRaw, SignerResult } from '../types';
export default class Signer {
    private provider;
    constructor(provider: ProviderPolkadot);
    signPayload: (payload: SignerPayloadJSON) => Promise<SignerResult>;
    signRaw: (payload: SignerPayloadRaw) => Promise<SignerResult>;
    toJSON(): {};
}
