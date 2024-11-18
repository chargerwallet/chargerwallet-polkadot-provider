"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Signer_1 = __importDefault(require("./Signer"));
const Accounts_1 = __importDefault(require("./Accounts"));
class default_1 {
    constructor(provider) {
        this.accounts = new Accounts_1.default(provider);
        this.metadata = undefined;
        this.provider = undefined;
        this.signer = new Signer_1.default(provider);
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
exports.default = default_1;
