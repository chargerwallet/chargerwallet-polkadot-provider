"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor(provider) {
        this.provider = provider;
        this.get = (anyType) => __awaiter(this, void 0, void 0, function* () {
            return this.provider.web3Accounts(anyType);
        });
        this.subscribe = (cb) => {
            // listener for account change
            const unsub = this.provider.web3AccountsSubscribe(cb);
            void this.get();
            return unsub;
        };
    }
    toJSON() {
        return {
            get: {},
            subscribe: {},
        };
    }
}
exports.default = default_1;
