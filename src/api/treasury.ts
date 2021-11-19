import BigNumber, { BigNumber as BigNumberJs } from "bignumber.js";
import { providers, Contract } from "ethers";
import erc20Abi from "../abis/erc20.json";
import { getReserves } from "./traderJoe";

const TREASURY_ADDR = "0xc0e7da06e56727f3b55b24f58e9503fdaafb2a68";

export enum TREASURY_TOKENS {
  mim = "mim",
  avax = "avax",
  spell = "spell",
  joe = "joe",
  weth = "weth",
}

const treasuryTokenAddresses: Record<TREASURY_TOKENS, string> = {
  avax: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
  joe: "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
  spell: "0xce1bffbd5374dac86a2893119683f4911a2f7814",
  mim: "0x130966628846bfd36ff31a822705796e8cb8c18d",
  weth: "0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab",
};

const treasuryTokenLPAddresses: Record<TREASURY_TOKENS, string | null> = {
  avax: "0x781655d802670bbA3c89aeBaaEa59D3182fD755D", // mim / avax
  joe: "0x454e67025631c065d3cfad6d71e6892f74487a15", // joe / avax
  spell: "0x62cf16bf2bc053e7102e2ac1dee5029b94008d99", // avax / spell
  mim: null,
  weth: "0xfe15c2695f1f920da45c30aae47d11de51007af9", // weth / avax
};

export const mimTokenPools: TREASURY_TOKENS[] = [
  TREASURY_TOKENS.avax,
  TREASURY_TOKENS.mim,
];

const getTreasuryTokenBalance: (
  symbol: TREASURY_TOKENS,
  provider: providers.JsonRpcProvider
) => Promise<BigNumberJs> = async (symbol, provider) => {
  const address = treasuryTokenAddresses[symbol as TREASURY_TOKENS];
  const contract = new Contract(address, erc20Abi, provider);
  const balance = await contract.balanceOf(TREASURY_ADDR);
  return new BigNumberJs(balance.toString());
};

const getTokenPrice: (
  symbol: TREASURY_TOKENS,
  provider: providers.JsonRpcProvider
) => Promise<BigNumberJs> = async (symbol, provider) => {
  if (treasuryTokenLPAddresses[symbol] === null) return new BigNumberJs(1);
  const [mimReserves, tokenReserves] = await getReserves(
    treasuryTokenLPAddresses[symbol]!,
    provider
  );
  return mimReserves.dividedBy(tokenReserves);
};

export { getTokenPrice, getTreasuryTokenBalance };
