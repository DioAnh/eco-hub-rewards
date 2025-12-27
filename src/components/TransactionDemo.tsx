import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSuiWallet } from "@/hooks/useSuiWallet";
import { Transaction } from "@mysten/sui/transactions";
import { Loader2, Send, Coins } from "lucide-react";

export const TransactionDemo = () => {
  const { 
    isConnected, 
    isExecuting, 
    walletAddress, 
    executeTransaction,
    getBalance 
  } = useSuiWallet();
  
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected) {
        setIsLoadingBalance(true);
        const bal = await getBalance();
        if (bal) {
          // Convert from MIST to SUI (1 SUI = 10^9 MIST)
          const suiBalance = (Number(bal.totalBalance) / 1_000_000_000).toFixed(4);
          setBalance(suiBalance);
        }
        setIsLoadingBalance(false);
      } else {
        setBalance(null);
      }
    };
    fetchBalance();
  }, [isConnected, getBalance]);

  const handleSendTransaction = async () => {
    if (!recipient || !amount) return;

    const tx = new Transaction();
    
    // Convert SUI to MIST
    const amountInMist = BigInt(Math.floor(parseFloat(amount) * 1_000_000_000));
    
    // Split coins and transfer
    const [coin] = tx.splitCoins(tx.gas, [amountInMist]);
    tx.transferObjects([coin], recipient);

    await executeTransaction(tx, {
      onSuccess: () => {
        setRecipient("");
        setAmount("");
        // Refresh balance
        getBalance().then((bal) => {
          if (bal) {
            const suiBalance = (Number(bal.totalBalance) / 1_000_000_000).toFixed(4);
            setBalance(suiBalance);
          }
        });
      },
    });
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send SUI
          </CardTitle>
          <CardDescription>
            Connect your wallet to send transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Please connect your Sui wallet to continue
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Send SUI
        </CardTitle>
        <CardDescription>
          Transfer SUI to another address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance Display */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Your Balance
          </span>
          {isLoadingBalance ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span className="font-mono font-medium">{balance} SUI</span>
          )}
        </div>

        {/* Recipient Input */}
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (SUI)</Label>
          <Input
            id="amount"
            type="number"
            step="0.0001"
            min="0"
            placeholder="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Send Button */}
        <Button 
          className="w-full" 
          onClick={handleSendTransaction}
          disabled={!recipient || !amount || isExecuting}
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing Transaction...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Transaction
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Connected: {walletAddress?.slice(0, 10)}...
        </p>
      </CardContent>
    </Card>
  );
};
