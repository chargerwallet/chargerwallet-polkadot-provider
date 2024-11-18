import type { InjectedProvider, ProviderList, ProviderMeta } from '@polkadot/extension-inject/types';
import type { ProviderInterfaceEmitCb, ProviderInterfaceEmitted } from '@polkadot/rpc-provider/types';
import { EventEmitter } from 'eventemitter3';
import { ProviderPolkadot } from '../ChargerwalletPolkadotProvider';
type CallbackHandler = (error?: null | Error, value?: unknown) => void;
type AnyFunction = (...args: any[]) => any;
interface SubscriptionHandler {
    callback: CallbackHandler;
    type: string;
}
export default class MessageProvider implements InjectedProvider {
    private provider;
    readonly _eventemitter: EventEmitter;
    _isConnected: boolean;
    readonly _subscriptions: Record<string, AnyFunction>;
    constructor(provider: ProviderPolkadot);
    get isClonable(): boolean;
    clone(): MessageProvider;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get hasSubscriptions(): boolean;
    /**
     * @summary Whether the node is connected or not.
     * @return {boolean} true if connected
     */
    get isConnected(): boolean;
    listProviders(): Promise<ProviderList>;
    /**
     * @summary Listens on events after having subscribed using the [[subscribe]] function.
     * @param  {ProviderInterfaceEmitted} type Event
     * @param  {ProviderInterfaceEmitCb}  sub  Callback
     * @return unsubscribe function
     */
    on(type: ProviderInterfaceEmitted, sub: ProviderInterfaceEmitCb): () => void;
    send(method: string, params: unknown[], _?: boolean, subscription?: SubscriptionHandler): Promise<any>;
    /**
     * @summary Spawn a provider on the extension background.
     */
    startProvider(key: string): Promise<ProviderMeta>;
    subscribe(type: string, method: string, params: unknown[], callback: AnyFunction): Promise<number>;
    /**
     * @summary Allows unsubscribing to subscriptions made with [[subscribe]].
     */
    unsubscribe(type: string, method: string, id: number): Promise<boolean>;
}
export {};
