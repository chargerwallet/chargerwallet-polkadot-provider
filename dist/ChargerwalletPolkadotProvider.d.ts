import type { IInpageProviderConfig } from '@chargerwallet/cross-inpage-provider-core';
import { ProviderPolkadotBase } from './ProviderPolkadotBase';
import type { IJsonRpcRequest } from '@chargerwallet/cross-inpage-provider-types';
import type { JsonRpcResponse } from '@polkadot/rpc-provider/types';
import { Unsubcall, InjectedAccount, ProviderList, ProviderMeta } from '@polkadot/extension-inject/types';
import { RequestRpcSend, RequestRpcSubscribe, RequestRpcUnsubscribe, SignerPayloadJSON, SignerPayloadRaw, SignerResult } from './types';
declare const PROVIDER_EVENTS: {
    readonly connect: "connect";
    readonly disconnect: "disconnect";
    readonly accountChanged: "accountChanged";
    readonly message_low_level: "message_low_level";
};
type CosmosProviderEventsMap = {
    [PROVIDER_EVENTS.connect]: (account: string) => void;
    [PROVIDER_EVENTS.disconnect]: () => void;
    [PROVIDER_EVENTS.accountChanged]: (account: InjectedAccount[]) => void;
    [PROVIDER_EVENTS.message_low_level]: (payload: IJsonRpcRequest) => void;
};
export type PolkadotRequest = {
    'web3Enable': (dappName: string) => Promise<boolean>;
    'web3Accounts': (anyType?: boolean) => Promise<InjectedAccount[]>;
    'web3AccountsSubscribe': (cb: (accounts: InjectedAccount[]) => any) => Promise<Unsubcall>;
    'web3SignPayload': (payload: SignerPayloadJSON) => Promise<SignerResult>;
    'web3SignRaw': (payload: SignerPayloadRaw) => Promise<SignerResult>;
    'web3RpcSubscribe': (payload: RequestRpcSubscribe, cb: (cb: JsonRpcResponse<unknown>) => void) => Promise<string | number>;
    'web3RpcUnSubscribe': () => Promise<boolean>;
    'web3RpcSubscribeConnected': (cb: (connected: boolean) => void) => boolean;
    'web3RpcSend': (payload: RequestRpcSend) => Promise<JsonRpcResponse<unknown>>;
    'web3RpcListProviders': () => Promise<ProviderList>;
    'web3RpcStartProvider': (payload: string) => Promise<ProviderMeta>;
};
export type PROVIDER_EVENTS_STRINGS = keyof typeof PROVIDER_EVENTS;
export interface IProviderPolkadot {
    isWeb3Injected: boolean;
    web3Enable: (dappName: string) => Promise<boolean>;
    web3Accounts: (anyType?: boolean) => Promise<InjectedAccount[]>;
    web3AccountsSubscribe: (cb: (accounts: InjectedAccount[]) => any) => Unsubcall;
    web3SignPayload: (payload: SignerPayloadJSON) => Promise<SignerResult>;
    web3SignRaw: (payload: SignerPayloadRaw) => Promise<SignerResult>;
    web3RpcSubscribe: (payload: RequestRpcSubscribe, cb: (accounts: JsonRpcResponse<unknown>) => void) => Promise<string | number>;
    web3RpcUnSubscribe: (payload: RequestRpcUnsubscribe) => Promise<boolean>;
    web3RpcSubscribeConnected: (cb: (connected: boolean) => void) => boolean;
    web3RpcSend: (payload: RequestRpcSend) => Promise<JsonRpcResponse<unknown>>;
    web3RpcListProviders: () => Promise<ProviderList>;
    web3RpcStartProvider: (payload: string) => Promise<ProviderMeta>;
}
export type ChargerWalletPolkadotProviderProps = IInpageProviderConfig & {
    timeout?: number;
};
declare class ProviderPolkadot extends ProviderPolkadotBase implements IProviderPolkadot {
    _account: string | null;
    constructor(props: ChargerWalletPolkadotProviderProps);
    isWeb3Injected: boolean;
    private _registerEvents;
    private _callBridge;
    private _handleConnected;
    private _handleDisconnected;
    private _handleAccountChange;
    private _network;
    isNetworkChanged(network: string): boolean;
    isConnected(): boolean;
    on<E extends keyof CosmosProviderEventsMap>(event: E, listener: CosmosProviderEventsMap[E]): this;
    emit<E extends keyof CosmosProviderEventsMap>(event: E, ...args: Parameters<CosmosProviderEventsMap[E]>): boolean;
    private createMessage;
    private _postMessage;
    postRequest(payload: any): void;
    postResponse(payload: any): void;
    postError(payload: string): void;
    web3Enable(dappName: string): Promise<boolean>;
    web3Accounts(anyType?: boolean): Promise<InjectedAccount[]>;
    web3AccountsSubscribe(cb: (accounts: InjectedAccount[]) => any): Unsubcall;
    web3SignPayload(payload: SignerPayloadJSON): Promise<SignerResult>;
    web3SignRaw(payload: SignerPayloadRaw): Promise<SignerResult>;
    web3RpcSubscribe(payload: RequestRpcSubscribe, cb: (accounts: JsonRpcResponse<unknown>) => void): Promise<string | number>;
    web3RpcUnSubscribe(): Promise<boolean>;
    web3RpcSubscribeConnected(cb: (connected: boolean) => void): boolean;
    web3RpcSend(payload: RequestRpcSend): Promise<JsonRpcResponse<unknown>>;
    web3RpcListProviders(): Promise<ProviderList>;
    web3RpcStartProvider(payload: string): Promise<ProviderMeta>;
}
declare const registerPolkadot: (provider: ProviderPolkadot, name?: string, version?: string) => void;
export { ProviderPolkadot, registerPolkadot };
