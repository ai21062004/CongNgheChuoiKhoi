// ============================================
// Wallet Context - MetaMask Wallet Integration
// ============================================
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { BrowserProvider, formatEther } from 'ethers';

interface WalletContextType {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<string>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProvider = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return new BrowserProvider(window.ethereum);
    }
    return null;
  };

  const fetchBalance = useCallback(async (addr: string) => {
    const provider = getProvider();
    if (provider) {
      try {
        const bal = await provider.getBalance(addr);
        setBalance(parseFloat(formatEther(bal)).toFixed(4));
      } catch {
        setBalance('0');
      }
    }
  }, []);

  const connect = useCallback(async (): Promise<string> => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask chưa được cài đặt. Vui lòng cài đặt MetaMask để tiếp tục.');
      }

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        await fetchBalance(accounts[0]);
        
        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));
        return accounts[0];
      }
      throw new Error('Không tìm thấy tài khoản');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể kết nối ví';
      setError(message);
      throw new Error(message);
    } finally {
      setIsConnecting(false);
    }
  }, [fetchBalance]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setBalance(null);
    setChainId(null);
    setError(null);
  }, []);

  // Listen for account/chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAddress(accounts[0]);
        fetchBalance(accounts[0]);
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      setChainId(parseInt(chainIdHex, 16));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [disconnect, fetchBalance]);

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        chainId,
        isConnected: !!address,
        isConnecting,
        error,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
}

// Add ethereum type to window
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}
