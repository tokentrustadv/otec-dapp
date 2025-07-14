import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import LicenseNFT from "../ABI/LicenseNFT.json";

export default function Mint() {
  const { address, isConnected } = useAccount();
  // ← match your .env.local and Vercel var exactly
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LICENSE_NFT_ADDRESS;

  // prepare the mintFounder transaction
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: LicenseNFT,                   // use `abi:` not `ABI:`
    functionName: "mintFounder",       // call your no-pay mint
    enabled: isConnected,              // only once the wallet’s connected
  });
  const { write, isLoading, isSuccess } = useContractWrite(config);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Mint Your Founder License</h1>
      <ConnectButton />

      {isConnected && (
        <button
          onClick={() => write?.()}
          disabled={!write || isLoading}
          className="bg-green-500 text-white rounded px-4 py-2 mt-6 hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? "Minting…" : "Mint Founder NFT"}
        </button>
      )}

      {isSuccess && (
        <p className="text-green-600 mt-4">
          ✅ Founder License minted! Check your wallet on Blockscout.
        </p>
      )}

      <footer className="mt-10 text-gray-500 text-xs">
        Powered by Base + OTEC Project
      </footer>
    </main>
  );
}
