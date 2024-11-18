var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getOrCreateExtInjectedJsBridge } from '@chargerwallet/extension-bridge-injected';
import { ProviderPolkadotBase } from './ProviderPolkadotBase';
import { injectExtension } from '@polkadot/extension-inject';
import ChargerWalletInjected from './inject/Injected';
const PROVIDER_EVENTS = {
    'connect': 'connect',
    'disconnect': 'disconnect',
    'accountChanged': 'accountChanged',
    'message_low_level': 'message_low_level',
};
function isWalletEventMethodMatch({ method, name }) {
    return method === `wallet_events_${name}`;
}
class ProviderPolkadot extends ProviderPolkadotBase {
    constructor(props) {
        super(Object.assign(Object.assign({}, props), { bridge: props.bridge || getOrCreateExtInjectedJsBridge({ timeout: props.timeout }) }));
        this._account = null;
        this.isWeb3Injected = true;
        this._registerEvents();
    }
    _registerEvents() {
        window.addEventListener('chargerwallet_bridge_disconnect', () => {
            this._handleDisconnected();
        });
        this.on(PROVIDER_EVENTS.message_low_level, (payload) => {
            if (!payload)
                return;
            const { method, params } = payload;
            if (isWalletEventMethodMatch({ method, name: PROVIDER_EVENTS.accountChanged })) {
                let temp = undefined;
                if (typeof params === 'string') {
                    temp = JSON.parse(params);
                }
                else if (typeof params === 'object') {
                    temp = params;
                }
                this._handleAccountChange(temp);
            }
        });
    }
    _callBridge(params) {
        return this.bridgeRequest(params);
    }
    _handleConnected(account, options = { emit: true }) {
        this._account = account;
        if (options.emit && this.isConnectionStatusChanged('connected')) {
            this.connectionStatus = 'connected';
            const address = account !== null && account !== void 0 ? account : null;
            this.emit('connect', address);
            // this.emit('keplr_keystorechange');
        }
    }
    _handleDisconnected(options = { emit: true }) {
        this._account = null;
        if (options.emit && this.isConnectionStatusChanged('disconnected')) {
            this.connectionStatus = 'disconnected';
            this.emit('disconnect');
            // this.emit('keplr_keystorechange');
        }
    }
    // trigger by bridge account change event
    _handleAccountChange(payload) {
        const account = payload ? [payload] : [];
        this.emit('accountChanged', account);
        if (!account) {
            this._handleDisconnected();
            return;
        }
    }
    isNetworkChanged(network) {
        return this._network === undefined || network !== this._network;
    }
    isConnected() {
        return this._account !== null;
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    createMessage(payload) {
        return Object.assign({ id: 2, origin: 'ChargerWallet Polkadot Provider' }, payload);
    }
    _postMessage(payload) {
        try {
            const message = this.createMessage(payload);
            window.postMessage(message);
        }
        catch (error) {
            // ignore
        }
    }
    postRequest(payload) {
        this._postMessage({
            request: payload,
        });
    }
    postResponse(payload) {
        this._postMessage({
            response: payload,
        });
    }
    postError(payload) {
        this._postMessage({
            error: payload,
        });
    }
    web3Enable(dappName) {
        return this._callBridge({
            method: 'web3Enable',
            params: dappName,
        });
    }
    web3Accounts(anyType) {
        const _super = Object.create(null, {
            emit: { get: () => super.emit }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield this._callBridge({
                method: 'web3Accounts',
                params: anyType !== null && anyType !== void 0 ? anyType : false,
            });
            _super.emit.call(this, 'accountChanged', accounts);
            return accounts;
        });
    }
    web3AccountsSubscribe(cb) {
        super.on(PROVIDER_EVENTS.accountChanged, cb);
        return () => {
            super.off(PROVIDER_EVENTS.accountChanged, cb);
        };
    }
    web3SignPayload(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.postRequest(payload);
                const result = yield this._callBridge({
                    method: 'web3SignPayload',
                    params: payload,
                });
                this.postResponse({
                    id: 1,
                    origin: 'ChargerWallet Polkadot Provider',
                    signature: result.signature,
                });
                return result;
            }
            catch (error) {
                this.postError('Cancelled');
                return Promise.reject('Cancelled');
            }
        });
    }
    web3SignRaw(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.postRequest(payload);
                const result = yield this._callBridge({
                    method: 'web3SignRaw',
                    params: payload,
                });
                this.postResponse({
                    id: 1,
                    origin: 'ChargerWallet Polkadot Provider',
                    signature: result.signature,
                });
                return result;
            }
            catch (error) {
                this.postError('Cancelled');
                return Promise.reject('Cancelled');
            }
        });
    }
    web3RpcSubscribe(payload, cb) {
        return this._callBridge({
            method: 'web3RpcSubscribe',
            params: payload,
        });
    }
    web3RpcUnSubscribe() {
        super.removeAllListeners();
        return this._callBridge({
            method: 'web3RpcUnSubscribe',
            params: undefined,
        });
    }
    web3RpcSubscribeConnected(cb) {
        cb(this.isConnected());
        super.on(PROVIDER_EVENTS.connect, cb);
        super.on(PROVIDER_EVENTS.disconnect, cb);
        return true;
    }
    web3RpcSend(payload) {
        return this._callBridge({
            method: 'web3RpcSend',
            params: payload,
        });
    }
    web3RpcListProviders() {
        return this._callBridge({
            method: 'web3RpcListProviders',
            params: undefined,
        });
    }
    web3RpcStartProvider(payload) {
        return this._callBridge({
            method: 'web3RpcStartProvider',
            params: payload,
        });
    }
}
const registerPolkadot = (provider, name = 'ChargerWallet', version = '1.0.0') => {
    try {
        const enableFn = (originName) => __awaiter(void 0, void 0, void 0, function* () {
            yield provider.web3Enable(originName);
            return new ChargerWalletInjected(provider);
        });
        injectExtension(enableFn, { name: name !== null && name !== void 0 ? name : 'ChargerWallet', version: version !== null && version !== void 0 ? version : '1.0.0' });
    }
    catch (error) {
        console.error(error);
    }
};
export { ProviderPolkadot, registerPolkadot };
