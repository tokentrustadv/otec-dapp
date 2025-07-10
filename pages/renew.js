import { useState, useEffect } from "react";
import {
  useAccount,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import LicenseNFT from "../ABI/LicenseNFT.json";

export default function Renew() {
  const { address, isConnected } = useAccount();
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LICENSE_NFT_ADDRESS;

  const [tokenIds, setTokenIds] = useState([]);
  const [selectedTokenId, setSelectedTokenId] = useState("");

  const { data: balance } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: LicenseNFT,
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  useEffect(() => {
    if (balance && Number(balance) > 0) {
      const tokens = [];
      for (let i = 0; i < Number(balance); i++) {
        tokens.push(i);
      }
      setTokenIds(tokens);
    }
  }, [balance]);

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: LicenseNFT,
    functionName: "renew",
    args: [selectedTokenId],
    enabled: Boolean(selectedTokenId),
  });
  const { write, isLoading, isSuccess } = useContractWrite(config);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Renew Your License</h1>
      <ConnectButton />

      {isConnected && (
        <div className="w-full max-w-md mt-6">
          {balance && Number(balance) > 0 ? (
            <>
              <label className="block mb-2 text-sm font-semibold">
                Select License NFT
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedTokenId}
                onChange={(e) => setSelectedTokenId(e.target.value)}
              >
                <option value="">-- choose a token --</option>
                {tokenIds.map((id) => (
                  <option key={id} value={id}>
                    License #{id}
                  </option>
                ))}
              </select>

              <button
                onClick={() => write?.()}
                disabled={!write || isLoading}
                className="bg-blue-500 text-white rounded px-4 py-2 mt-4 hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? "Renewing..." : "Renew License"}
              </button>

              {isSuccess && (
                <p className="text-green-600 mt-4">
                  ✅ License renewed successfully!
                </p>
              )}
            </>
          ) : (
            <p className="text-red-600 mt-4">
              You do not own any License NFTs yet.
            </p>
          )}
        </div>
      )}

      <footer className="mt-10 text-gray-500 text-xs">
        Powered by Base + OTEC Project
      </footer>
    </main>
  )
}
