import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import LicenseNFT from "../ABI/LicenseNFT.json";

export default function Mint() {
  const { address, isConnected } = useAccount();
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LICENSE_NFT_ADDRESS;

  // 1) Read the allowlist mapping for this wallet
  const { data: isAllowed } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: LicenseNFT,
    functionName: "allowlist",
    args: [address],
    watch: true,
  });

  // 2) Prepare mintFounder() only if connected AND allowed
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: LicenseNFT,
    functionName: "mintFounder",
    enabled: isConnected && Boolean(isAllowed),
  });
  const { write, isLoading, isSuccess } = useContractWrite(config);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Mint Your Founder License</h1>
      <ConnectButton />

      {isConnected && (
        <>
          {/* 3) Show warning if connected but not on allowlist */}
          {!isAllowed && (
            <p className="text-red-600 mt-4">
              ⚠️ You are not on the allowlist. Please subscribe on Substack to join.
            </p>
          )}

          {/* 4) Show mint button only when allowed */}
          {isAllowed && (
            <button
              onClick={() => write?.()}
              disabled={!write || isLoading}
              className="bg-green-500 text-white rounded px-4 py-2 mt-6 hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? "Minting…" : "Mint Founder NFT"}
            </button>
          )}
        </>
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
