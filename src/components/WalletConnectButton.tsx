import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSuiWallet } from "@/hooks/useSuiWallet";
import { Wallet, LogOut, Copy, ExternalLink, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const WalletConnectButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    isConnected,
    isConnecting,
    shortAddress,
    walletAddress,
    currentWallet,
    wallets,
    connectWallet,
    disconnectWallet,
  } = useSuiWallet();

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast.success("Address copied to clipboard");
    }
  };

  const handleViewExplorer = () => {
    if (walletAddress) {
      window.open(`https://suiscan.xyz/mainnet/account/${walletAddress}`, "_blank");
    }
  };

  if (isConnecting) {
    return (
      <Button size="sm" disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (isConnected && shortAddress) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline" className="gap-2">
            {currentWallet?.icon && (
              <img src={currentWallet.icon} alt="" className="w-4 h-4" />
            )}
            {shortAddress}
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleCopyAddress}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleViewExplorer}>
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnectWallet} className="text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button size="sm" onClick={() => setIsDialogOpen(true)}>
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Connect Wallet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {wallets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No wallets detected</p>
                <Button variant="outline" asChild>
                  <a 
                    href="https://slush.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Install Slush Wallet
                  </a>
                </Button>
              </div>
            ) : (
              wallets.map((wallet) => (
                <Button
                  key={wallet.name}
                  variant="outline"
                  className="w-full justify-start gap-3 h-14"
                  onClick={() => {
                    connectWallet(wallet);
                    setIsDialogOpen(false);
                  }}
                >
                  {wallet.icon && (
                    <img src={wallet.icon} alt="" className="w-8 h-8 rounded" />
                  )}
                  <div className="text-left">
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {wallet.name.toLowerCase().includes("slush") ? "Recommended" : "Sui Wallet"}
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
          <p className="text-xs text-center text-muted-foreground">
            By connecting, you agree to the Terms of Service
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};
