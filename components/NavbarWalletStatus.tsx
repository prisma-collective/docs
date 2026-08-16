'use client';

import { useAuth } from '@/contexts/AuthContext';
import { WalletStatusIcon } from '@/components/WalletStatusIcon';

export default function NavbarWalletStatus() {
  const { status, isConnecting, connectWallet, disconnect } = useAuth();

  return (
    <WalletStatusIcon
      status={status}
      size={20}
      onClick={() => {
        if (isConnecting || status === 'connecting' || status === 'verifying') return;
        if (status === 'verified' || status === 'no-did') {
          disconnect();
          return;
        }
        void connectWallet();
      }}
    />
  );
}
