import { useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import LicenseNFT from "../ABI/LicenseNFT.json";

export default function Mint() {
  const { address, isConnected } = useAccount();
  const [contentURI, setContentURI] = useState("");

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LICENSE_NFT;

  // prepare mint transaction
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    ABI: LicenseNFT.ABI,
    functionName: "licenseContent",
    args: [contentURI],
    enabled: Boolean(contentURI && isConnected),
  });

  const { write, isLoading, isSuccess } = useContractWrite(config);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Mint Your License NFT</h1>

      <ConnectButton />

      {isConnected && (
        <>
          <div className="w-full max-w-md mt-6">
            <label className="block mb-2 text-sm font-semibold">
              Content URI (Arweave / IPFS)
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="ar:// or ipfs:// link"
              value={contentURI}
              onChange={(e) => setContentURI(e.target.value)}
            />
            <button
              onClick={() => write?.()}
              disabled={!write || isLoading}
              className="bg-green-500 text-white rounded px-4 py-2 mt-4 hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? "Minting..." : "Mint License"}
            </button>

            {isSuccess && (
              <p className="text-green-600 mt-4">
                ✅ License minted successfully! Check your wallet on Basescan.
              </p>
            )}
          </div>
        </>
      )}

      <footer className="mt-10 text-gray-500 text-xs">
        Powered by Base + OTEC Project
      </footer>
    </main>
  );
}
