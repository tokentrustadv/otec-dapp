import { useAccount, useContractRead, useNetwork } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import LicenseNFT from "../abi/LicenseNFT.json";  // make sure you add this ABI later!

export default function Home() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  // contract
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LICENSE_NFT;

  // check allowlist from contract
  const { data: isAllowed, refetch } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: LicenseNFT.abi,
    functionName: "allowlist",
    args: [address],
    watch: true,
  });

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      <h1 className="text-4xl font-bold mb-4 text-otec">
        OTEC Licensing Dapp
      </h1>

      <ConnectButton />

      {isConnected && (
        <>
          <div className="mt-4">
            {isAllowed ? (
              <p className="text-green-600 font-semibold">
                ✅ You are an active Founding Member. Welcome!
              </p>
            ) : (
              <p className="text-red-600 font-semibold">
                ⚠️ You are not on the allowlist. Please subscribe on Substack to join.
              </p>
            )}
          </div>

          {isAllowed && (
            <div className="flex gap-4 mt-6">
              <a
                href="/mint"
                className="bg-green-500 text-white rounded p-2 hover:bg-green-600"
              >
                Mint License
              </a>
              <a
                href="/renew"
                className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
              >
                Renew License
              </a>
            </div>
          )}
        </>
      )}

      <footer className="mt-10 text-gray-500 text-xs">
        Powered by Base + OTEC Project
      </footer>
    </main>
  );
}
