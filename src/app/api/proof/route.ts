import { NextRequest, NextResponse } from "next/server";
import { getProofForAddress, getMerkleRoot } from "~/lib/merkle";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 }
    );
  }

  // Validate address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json(
      { error: "Invalid address format" },
      { status: 400 }
    );
  }

  try {
    const result = getProofForAddress(address);

    if (!result) {
      console.log(`Address not on allowlist: ${address}`);
      return NextResponse.json(
        {
          error: "Address not on allowlist",
          isAllowlisted: false,
          merkleRoot: getMerkleRoot(),
        },
        { status: 404 }
      );
    }

    const { proof, entry } = result;

    console.log(`Proof generated for ${address}:`, {
      proofLength: proof.length,
      maxClaimable: entry.maxClaimable.toString(),
      priceWei: entry.priceWei.toString(),
    });

    return NextResponse.json({
      isAllowlisted: true,
      proof,
      quantityLimitPerWallet: entry.maxClaimable.toString(),
      pricePerToken: entry.priceWei.toString(),
      currency: entry.currencyAddress,
      merkleRoot: getMerkleRoot(),
    });

  } catch (error) {
    console.error("Error generating proof:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
