'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type AuthStatus = 'disconnected' | 'connecting' | 'verifying' | 'verified' | 'no-did';
type WalletInfo = { name: string; icon: string; apiVersion: string };
type ConnectedWallet = { key: string; info: WalletInfo };

type CardanoWalletApi = {
  getRewardAddresses: () => Promise<string[]>;
  signData: (address: string, payload: string) => Promise<{ signature: string; key?: string }>;
};

type CardanoWalletProvider = {
  name?: string;
  icon?: string;
  apiVersion?: string;
  enable: () => Promise<CardanoWalletApi>;
};

type AuthState = {
  status: AuthStatus;
  sessionToken: string | null;
  role: string | null;
  did: string | null;
  availableWallets: WalletInfo[];
  connectedWallet: ConnectedWallet | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: (walletName?: string) => Promise<void>;
  disconnect: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = 'private-docs-session';
const WALLET_STORAGE_KEY = 'private-docs-wallet';
const KNOWN_WALLET_KEYS = ['eternl', 'nami', 'lace', 'flint', 'yoroi', 'typhon', 'gerowallet', 'nufi'];

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_PRIVATE_API_BASE_URL || '';
}

function getInfraToken(): string {
  return process.env.NEXT_PUBLIC_PRIVATE_API_TOKEN || '';
}

function getCardanoNetwork(): 'mainnet' | 'preprod' {
  return process.env.NEXT_PUBLIC_CARDANO_NETWORK === 'mainnet' ? 'mainnet' : 'preprod';
}

async function fetchNonce(address: string): Promise<string> {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/nonce?address=${encodeURIComponent(address)}`, {
    headers: { Authorization: `Bearer ${getInfraToken()}` },
  });
  if (!response.ok) throw new Error('nonce_failed');
  const data = (await response.json()) as { nonce: string };
  return data.nonce;
}

async function postDidPrepare(rewardHexes: string[], network: 'mainnet' | 'preprod') {
  return fetch(`${getApiBaseUrl()}/api/auth/did-prepare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getInfraToken()}`,
    },
    body: JSON.stringify({ rewardHexes, network }),
  });
}

async function verifySession(
  address: string,
  signature: string,
  nonce: string,
  prepareTicket: string
) {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getInfraToken()}`,
    },
    body: JSON.stringify({ address, signature, nonce, prepareTicket }),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
  const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() => {
    if (typeof window === 'undefined') return 'disconnected';
    const hasSession = window.sessionStorage.getItem(STORAGE_KEY);
    return hasSession ? 'verified' : 'disconnected';
  });
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return (JSON.parse(raw) as { sessionToken?: string }).sessionToken ?? null;
    } catch {
      return null;
    }
  });
  const [role, setRole] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return (JSON.parse(raw) as { role?: string }).role ?? null;
    } catch {
      return null;
    }
  });
  const [did, setDid] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return (JSON.parse(raw) as { did?: string }).did ?? null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    console.info('[AuthProvider] init', {
      status,
      hasStoredSession: Boolean(window.sessionStorage.getItem(STORAGE_KEY)),
      hasSessionToken: Boolean(sessionToken),
    });
  }, []);

  useEffect(() => {
    const scanWallets = () => {
      if (typeof window === 'undefined') return;
      const w = window as Window & { cardano?: Record<string, CardanoWalletProvider> };
      const cardano = w.cardano;
      if (!cardano) {
        setAvailableWallets([]);
        return;
      }

      const wallets: WalletInfo[] = [];

      for (const key of KNOWN_WALLET_KEYS) {
        const wallet = cardano[key];
        if (wallet && typeof wallet.enable === 'function') {
          wallets.push({
            name: wallet.name || key,
            icon: wallet.icon || '',
            apiVersion: wallet.apiVersion || '0.1.0',
          });
        }
      }

      for (const key of Object.keys(cardano)) {
        if (KNOWN_WALLET_KEYS.includes(key)) continue;
        const wallet = cardano[key];
        if (wallet && typeof wallet.enable === 'function' && wallet.name) {
          wallets.push({
            name: wallet.name,
            icon: wallet.icon || '',
            apiVersion: wallet.apiVersion || '0.1.0',
          });
        }
      }

      setAvailableWallets(wallets);
    };

    scanWallets();
    const timeout = window.setTimeout(scanWallets, 1000);
    return () => window.clearTimeout(timeout);
  }, []);

  const disconnect = useCallback(() => {
    setStatus('disconnected');
    setSessionToken(null);
    setRole(null);
    setDid(null);
    setConnectedWallet(null);
    setError(null);
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(WALLET_STORAGE_KEY);
    }
  }, []);

  const connectWallet = useCallback(async (walletName?: string) => {
    if (typeof window === 'undefined') return;
    const w = window as Window & { cardano?: Record<string, CardanoWalletProvider> };
    const cardano = w.cardano;

    if (!cardano) {
      setError('No Cardano wallets detected');
      setStatus('disconnected');
      return;
    }

    setIsConnecting(true);
    setError(null);
    setStatus('connecting');

    try {
      const desiredName = walletName?.toLowerCase();
      let walletKey = Object.keys(cardano).find((key) => {
        const providerName = cardano[key]?.name?.toLowerCase();
        return desiredName ? key.toLowerCase() === desiredName || providerName === desiredName : false;
      });

      if (!walletKey && !walletName) {
        const remembered = window.localStorage.getItem(WALLET_STORAGE_KEY);
        if (remembered && cardano[remembered]) walletKey = remembered;
      }

      if (!walletKey && !walletName) {
        walletKey = KNOWN_WALLET_KEYS.find((key) => Boolean(cardano[key])) || Object.keys(cardano)[0];
      }

      if (!walletKey || !cardano[walletKey]) {
        setStatus('disconnected');
        throw new Error('wallet_not_found');
      }

      const provider = cardano[walletKey];
      const wallet = await provider.enable();
      if (typeof wallet.signData !== 'function') {
        setStatus('disconnected');
        throw new Error('wallet_sign_data_unsupported');
      }
      if (typeof wallet.getRewardAddresses !== 'function') {
        setStatus('disconnected');
        throw new Error('wallet_reward_addresses_unsupported');
      }

      setConnectedWallet({
        key: walletKey,
        info: {
          name: provider.name || walletKey,
          icon: provider.icon || '',
          apiVersion: provider.apiVersion || '0.1.0',
        },
      });

      window.localStorage.setItem(WALLET_STORAGE_KEY, walletKey);

      const rewardHexes = await wallet.getRewardAddresses();
      if (!rewardHexes || rewardHexes.length === 0) {
        setStatus('disconnected');
        throw new Error('wallet_reward_addresses_missing');
      }

      const network = getCardanoNetwork();

      // Always wait for did-prepare (server decodes stake + indexer). No client WASM — use
      // stakeBech32 from the response for nonce + signData (CIP-30 accepts reward/stake bech32).
      const prepRes = await postDidPrepare(rewardHexes, network);
      if (!prepRes.ok) {
        if (prepRes.status === 401) {
          setStatus('no-did');
          return;
        }
        setStatus('disconnected');
        throw new Error('did_prepare_failed');
      }

      const prepData = (await prepRes.json()) as {
        prepareTicket: string;
        stakeBech32: string;
        did: string;
        role: string;
      };
      const { stakeBech32, prepareTicket } = prepData;

      setStatus('verifying');
      const nonce = await fetchNonce(stakeBech32);

      const signed = await wallet.signData(stakeBech32, nonce);
      const result = await verifySession(stakeBech32, signed.signature, nonce, prepareTicket);

      if (!result.ok) {
        if (result.status === 401 || result.status === 403) {
          setStatus('no-did');
          return;
        }
        setStatus('disconnected');
        throw new Error('verify_failed');
      }

      const token = (result.data as { sessionToken: string }).sessionToken;
      const grantedRole = (result.data as { role: string }).role;
      const grantedDid = (result.data as { did: string }).did;
      setSessionToken(token);
      setRole(grantedRole);
      setDid(grantedDid);
      setStatus('verified');
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ sessionToken: token, role: grantedRole, did: grantedDid })
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'wallet_connect_failed';
      setError(message);
      setSessionToken(null);
      setRole(null);
      setDid(null);
      setConnectedWallet(null);
      window.localStorage.removeItem(WALLET_STORAGE_KEY);
      setStatus('disconnected');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      status,
      sessionToken,
      role,
      did,
      availableWallets,
      connectedWallet,
      isConnecting,
      error,
      connectWallet,
      disconnect,
    }),
    [
      status,
      sessionToken,
      role,
      did,
      availableWallets,
      connectedWallet,
      isConnecting,
      error,
      connectWallet,
      disconnect,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
