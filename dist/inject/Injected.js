import Signer from './Signer';
import Accounts from './Accounts';
export default class {
    constructor(provider) {
        this.accounts = new Accounts(provider);
        this.metadata = undefined;
        this.provider = undefined;
        this.signer = new Signer(provider);
    }
    toJSON() {
        return {
            accounts: this.accounts,
            metadata: this.metadata,
            provider: this.provider,
            signer: this.signer,
        };
    }
}
