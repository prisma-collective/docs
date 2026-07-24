import { Address, RewardAddress } from '@emurgo/cardano-serialization-lib-browser';

/** Same rules as @prisma-dids/sdk deriveDID (TECHNICAL_DESIGN §4). */
export function deriveDID(stakeAddress: string): string {
  if (!stakeAddress.startsWith('stake1') && !stakeAddress.startsWith('stake_test1')) {
    throw new Error('Invalid stake address format');
  }
  return `did:cardano:${stakeAddress}`;
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim().replace(/^0x/i, '');
  if (clean.length % 2 !== 0) throw new Error('Invalid hex');
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

/** CIP-30 reward credential hex → stake bech32 (same as dashboard / SDK address util). */
export function hexStakeAddressToBech32(hexAddress: string): string {
  const bytes = hexToBytes(hexAddress);
  const addr = Address.from_bytes(bytes);
  const rewardAddr = RewardAddress.from_address(addr);
  if (!rewardAddr) {
    throw new Error('Invalid stake address format');
  }
  const networkId = rewardAddr.to_address().network_id();
  const prefix = networkId === 1 ? 'stake' : 'stake_test';
  return rewardAddr.to_address().to_bech32(prefix);
}
