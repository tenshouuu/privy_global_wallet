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
  console.log('Privy user', user);

  const { signTransaction } = useCrossAppAccounts();
  const { logout } = useLogout();

  const { login } = useLogin();

  const [isSigning, setIsSigning] = useState(false);
  const [signResult, setSignResult] = useState<string | null>(null);
  const [signError, setSignError] = useState<string | null>(null);

  const crossAppAccount = user?.linkedAccounts?.find(
    (account) => account.type === 'cross_app' && account.providerApp.id === NEURA_PROVIDER_APP_ID
  ) as CrossAppAccount | undefined


  const isConnected = !!crossAppAccount && ready && authenticated && walletsReady;
  const neuraGlobalWalletAccount = crossAppAccount?.embeddedWallets?.[0]?.address;

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

  // Handle transaction signing without chainId (using type assertion to bypass TypeScript)
  const handleSignTransactionWithoutChainId = async () => {
    if (!crossAppAccount || !neuraGlobalWalletAccount) {
      setSignError('No cross-app account or wallet address available');
      return;
    }

    setIsSigning(true);
    setSignError(null);
    setSignResult(null);

    try {
      const testTransaction = baseTransactionProps;

      console.log('Signing transaction without chainId:', testTransaction);

      // Type assertion to bypass TypeScript requirement for chainId
      const signature = await signTransaction(testTransaction as any, { address: neuraGlobalWalletAccount });

      setSignResult(`Transaction without chainId signed successfully! Signature: ${signature}`);
      console.log('Transaction signature:', signature);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSignError(`Failed to sign transaction without chainId: ${errorMessage}`);
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

      <button onClick={() => logout()}>Logout</button>
      <br/>
      <br/>

      {/* Transaction signing buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <button
          onClick={handleSignTransactionWithoutChainId}
          disabled={isSigning}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: isSigning ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            backgroundColor: 'green',
            color: 'white',
          }}
        >
          {isSigning ? 'Signing...' : 'Sign Transaction (No ChainId)'}
        </button>

        <button
          onClick={handleSignTransactionWithChainId}
          disabled={isSigning}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: isSigning ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            backgroundColor: 'red',
            color: 'white',
          }}
        >
          {isSigning ? 'Signing...' : `Sign Transaction (With ChainId ${DEFAULT_CHAIN_ID})`}
        </button>
      </div>

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

    <button onClick={() => login()}>Login</button>
  </div>);
}
