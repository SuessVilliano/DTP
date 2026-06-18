import { NextRequest, NextResponse } from 'next/server'
import { Connection, PublicKey } from '@solana/web3.js'

// DTP Token balance check — Solana SPL token

const DTP_TOKEN_MINT = process.env.NEXT_PUBLIC_DTP_TOKEN_MINT || 'PLACEHOLDER_DTP_TOKEN_MINT_ADDRESS'
const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
const TOKEN_DECIMALS = parseInt(process.env.NEXT_PUBLIC_DTP_TOKEN_DECIMALS || '9')

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const walletAddress = searchParams.get('wallet')

  if (!walletAddress) {
    return NextResponse.json({ error: 'wallet address required' }, { status: 400 })
  }

  let walletPubkey: PublicKey
  try {
    walletPubkey = new PublicKey(walletAddress)
  } catch {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  if (DTP_TOKEN_MINT === 'PLACEHOLDER_DTP_TOKEN_MINT_ADDRESS') {
    return NextResponse.json({
      wallet: walletAddress,
      balance: 0,
      decimals: TOKEN_DECIMALS,
      mint: DTP_TOKEN_MINT,
      note: 'Token not yet deployed',
    })
  }

  try {
    const connection = new Connection(SOLANA_RPC, 'confirmed')
    const mintPubkey = new PublicKey(DTP_TOKEN_MINT)

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPubkey, {
      mint: mintPubkey,
    })

    if (tokenAccounts.value.length === 0) {
      return NextResponse.json({
        wallet: walletAddress,
        balance: 0,
        decimals: TOKEN_DECIMALS,
        mint: DTP_TOKEN_MINT,
      })
    }

    const rawBalance = tokenAccounts.value.reduce((sum, account) => {
      const amount = account.account.data.parsed?.info?.tokenAmount?.uiAmount || 0
      return sum + amount
    }, 0)

    let tier = 'free'
    if (rawBalance >= parseInt(process.env.NEXT_PUBLIC_WHALE_TIER_AMOUNT || '10000')) {
      tier = 'whale'
    } else if (rawBalance >= parseInt(process.env.NEXT_PUBLIC_BULL_TIER_AMOUNT || '1000')) {
      tier = 'bull'
    }

    return NextResponse.json(
      { wallet: walletAddress, balance: rawBalance, decimals: TOKEN_DECIMALS, mint: DTP_TOKEN_MINT, tier },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
    )
  } catch (error) {
    console.error('[token balance]', error)
    return NextResponse.json(
      { error: 'Failed to fetch token balance', wallet: walletAddress, balance: 0 },
      { status: 500 }
    )
  }
}
