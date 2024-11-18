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
const eventemitter3_1 = require("eventemitter3");
function isUndefined(value) {
    return value === undefined;
}
class MessageProvider {
    constructor(provider) {
        this.provider = provider;
        // Whether or not the actual extension background provider is connected
        this._isConnected = false;
        // Subscription IDs are (historically) not guaranteed to be globally unique;
        // only unique for a given subscription method; which is why we identify
        // the subscriptions based on subscription id + type
        this._subscriptions = {};
        this._eventemitter = new eventemitter3_1.EventEmitter();
    }
    get isClonable() {
        return true;
    }
    clone() {
        return new MessageProvider(this.provider);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            // FIXME This should see if the extension's state's provider can disconnect
            console.error('PostMessageProvider.disconnect() is not implemented.');
        });
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            // FIXME This should see if the extension's state's provider can disconnect
            console.error('PostMessageProvider.disconnect() is not implemented.');
        });
    }
    get hasSubscriptions() {
        // FIXME This should see if the extension's state's provider has subscriptions
        return true;
    }
    /**
     * @summary Whether the node is connected or not.
     * @return {boolean} true if connected
     */
    get isConnected() {
        return this._isConnected;
    }
    listProviders() {
        return this.provider.web3RpcListProviders();
    }
    /**
     * @summary Listens on events after having subscribed using the [[subscribe]] function.
     * @param  {ProviderInterfaceEmitted} type Event
     * @param  {ProviderInterfaceEmitCb}  sub  Callback
     * @return unsubscribe function
     */
    on(type, sub) {
        this._eventemitter.on(type, sub);
        return () => {
            this._eventemitter.removeListener(type, sub);
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    send(method, params, _, subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            if (subscription) {
                const { callback, type } = subscription;
                const id = yield this.provider.web3RpcSubscribe({ method, params, type }, (res) => {
                    subscription.callback(null, res);
                });
                // const id = await sendRequest('pub(rpc.subscribe)', { method, params, type }, (res): void => {
                //   subscription.callback(null, res);
                // });
                this._subscriptions[`${type}::${id}`] = callback;
                return id;
            }
            return this.provider.web3RpcSend({ method, params });
        });
    }
    /**
     * @summary Spawn a provider on the extension background.
     */
    startProvider(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // Disconnect from the previous provider
            this._isConnected = false;
            this._eventemitter.emit('disconnected');
            // const meta = await sendRequest('pub(rpc.startProvider)', key);
            const meta = yield this.provider.web3RpcStartProvider(key);
            this.provider.web3RpcSubscribeConnected((connected) => {
                this._isConnected = connected;
                if (connected) {
                    this._eventemitter.emit('connected');
                }
                else {
                    this._eventemitter.emit('disconnected');
                }
                return true;
            });
            return meta;
        });
    }
    subscribe(type, method, params, callback) {
        return this.send(method, params, false, { callback, type });
    }
    /**
     * @summary Allows unsubscribing to subscriptions made with [[subscribe]].
     */
    unsubscribe(type, method, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = `${type}::${id}`;
            // FIXME This now could happen with re-subscriptions. The issue is that with a re-sub
            // the assigned id now does not match what the API user originally received. It has
            // a slight complication in solving - since we cannot rely on the send id, but rather
            // need to find the actual subscription id to map it
            if (isUndefined(this._subscriptions[subscription])) {
                console.debug(`Unable to find active subscription=${subscription}`);
                return false;
            }
            delete this._subscriptions[subscription];
            yield this.provider.web3RpcUnSubscribe();
            return this.send(method, [id]);
        });
    }
}
exports.default = MessageProvider;
