import { DEFAULT_CHAIN_ID, NEURA_PROVIDER_APP_ID } from '@/modules/const';
import {
  useLogin,
  useLogout,
  usePrivy,
  useWallets,
  useCrossAppAccounts,
  CrossAppAccount,
} from '@privy-io/react-auth';
import { useState, useEffect } from 'react';

export function PrivySample() {
  const { authenticated, ready, user } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();
  console.log('Privy user', user, wallets);

  const { signTransaction } = useCrossAppAccounts();
  const { logout } = useLogout();

  const { login } = useLogin();

  const [isSigning, setIsSigning] = useState(false);
  const [signResult, setSignResult] = useState<string | null>(null);
  const [signError, setSignError] = useState<string | null>(null);

  // Regarding to https://docs.privy.io/wallets/global-wallets/integrate-a-global-wallet/getting-global-wallets#getting-global-wallets
  const crossAppAccount = user?.linkedAccounts?.find(
    (account) => account.type === 'cross_app' && account.providerApp.id === NEURA_PROVIDER_APP_ID
  ) as CrossAppAccount | undefined;
  const neuraGlobalWalletAccount = crossAppAccount?.embeddedWallets?.[0]?.address;


  const isConnected = !!crossAppAccount && ready && authenticated && walletsReady;

  // Reset state when connection status changes
  useEffect(() => {
    setSignResult(null);
    setSignError(null);
    setIsSigning(false);
  }, [isConnected]);

  // Base transaction properties
  const baseTransactionProps = {
    to: neuraGlobalWalletAccount, // Self-transfer to same address
    value: '0', // 0 ETH
    gas: '21000', // Standard gas limit for simple transfers
    gasPrice: '20000000000', // 20 gwei
    nonce: '0',
    data: '0x', // Empty data
  };

  // Handle transaction signing with chainId
  const handleSignTransactionWithChainId = async () => {
    if (!crossAppAccount || !neuraGlobalWalletAccount) {
      setSignError('No cross-app account or wallet address available');
      return;
    }

    setIsSigning(true);
    setSignError(null);
    setSignResult(null);

    try {
      const testTransaction = {
        ...baseTransactionProps,
        chainId: DEFAULT_CHAIN_ID,
      };

      console.log('Signing transaction with chainId:', testTransaction);

      // https://docs.privy.io/wallets/global-wallets/integrate-a-global-wallet/using-global-wallets
      const signature = await signTransaction(testTransaction, { address: neuraGlobalWalletAccount });

      setSignResult(`Transaction with chainId signed successfully! Signature: ${signature}`);
      console.log('Transaction signature:', signature);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSignError(`Failed to sign transaction with chainId: ${errorMessage}`);
      console.error('Transaction signing error:', error);
    } finally {
      setIsSigning(false);
    }
  };

  if (isConnected) {
    return <div>
      <h2>Connected</h2>
      <br/>
      <div>Account address: <b>{neuraGlobalWalletAccount || 'Account address not fount on the Neura Global Wallet'}</b>
      </div>
      <br/>

      <button
        style={{
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          color: 'white',
          marginBottom: '20px',
        }}
        onClick={() => logout()}>Logout</button>
      <br/>
      <br/>

      {/* Transaction signing button */}
      <button
        onClick={handleSignTransactionWithChainId}
        disabled={isSigning}
        style={{
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: isSigning ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          backgroundColor: 'green',
          color: 'white',
          marginBottom: '20px',
        }}
      >
        {isSigning ? 'Signing...' : 'Sign Transaction'}
      </button>

      {/* Results display */}
      {signResult && (
        <div style={{
          marginTop: '10px',
          padding: '15px',
          border: '1px solid #c3e6cb',
          borderRadius: '5px',
          maxWidth: '600px',
          wordBreak: 'break-all'
        }}>
          <strong>✅ Success:</strong> {signResult}
        </div>
      )}

      {signError && (
        <div style={{
          marginTop: '10px',
          padding: '15px',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          maxWidth: '600px',
          wordBreak: 'break-all'
        }}>
          <strong>❌ Error:</strong> {signError}
        </div>
      )}
    </div>
  }

  return (<div>
    <h2>Not Connected</h2>

    <br />

    <button
      onClick={() => login()}
      style={{
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        color: 'white',
        marginBottom: '20px',
      }}
    >
      Login
    </button>
  </div>);
}
