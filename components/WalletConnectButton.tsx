'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function WalletConnectButton() {
  const { status, role, availableWallets, connectedWallet, isConnecting, error, connectWallet, disconnect } = useAuth();
  const isConnected = status === 'verified';

  return (
    <div className="inline-flex items-center gap-2 text-xs">
      {isConnected || status === 'no-did' ? (
        <>
          <button
            type="button"
            onClick={() => disconnect()}
            className="rounded-lg border border-neutral-700/60 bg-transparent px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:bg-neutral-800/40 hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500/60"
          >
            Disconnect
          </button>
          <span className="text-xs text-neutral-500">
            {connectedWallet?.info.name || (isConnected ? `role: ${role}` : 'no-did')}
          </span>
        </>
      ) : (
        <>
          <select
            className="rounded-lg border border-neutral-700/60 bg-transparent px-2 py-1.5 text-xs text-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500/60"
            defaultValue=""
            onChange={(event) => {
              const walletName = event.target.value;
              if (!walletName) return;
              void connectWallet(walletName);
              event.currentTarget.value = '';
            }}
            disabled={isConnecting || availableWallets.length === 0}
          >
            <option value="" disabled>
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </option>
            {availableWallets.map((wallet) => (
              <option key={wallet.name} value={wallet.name}>
                {wallet.name}
              </option>
            ))}
          </select>
          <span className="text-xs text-neutral-500">
            {error || (availableWallets.length === 0 ? 'no wallet found' : status)}
          </span>
        </>
      )}
    </div>
  );
}

