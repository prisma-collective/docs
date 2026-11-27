type LockPromptVariant = 'disconnected' | 'no-did' | 'insufficient-role';

const messages: Record<LockPromptVariant, string> = {
  disconnected: 'Connect your wallet to access this page.',
  'no-did': 'No DID was found for this wallet address.',
  'insufficient-role': 'Your role does not grant access to this page.',
};

export default function LockPrompt({ variant }: { variant: LockPromptVariant }) {
  return (
    <div className="rounded-lg border border-purple-400/30 bg-purple-400/10 p-4 text-sm text-purple-100">
      {messages[variant]}
    </div>
  );
}

