import { ethers, Contract } from "ethers";
import BigNumber, { BigNumber as BigNumberJs } from "bignumber.js";
import joePairAbi from "../abis/joePair.json";

const MIM_SDOG_LP_ADDR = "0xa3f1f5076499ec37d5bb095551f85ab5a344bb58";

const ankrProviderUrl = "https://rpc.ankr.com/avalanche";

const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(ankrProviderUrl);
};

const getSdogMimReserves = async (
  provider: ethers.providers.JsonRpcProvider
) => {
  const [mimReserves, sdogReserves] = await getReserves(
    MIM_SDOG_LP_ADDR,
    provider
  );
  return {
    mimReserves: new BigNumberJs(mimReserves.toString()),
    sdogReserves: new BigNumberJs(sdogReserves.toString()),
  };
};

const getReserves = async (
  poolAddress: string,
  provider: ethers.providers.JsonRpcProvider
) => {
  const lpContract = new Contract(poolAddress, joePairAbi, provider);
  const reserves: [BigNumber, BigNumber] = await lpContract.getReserves();
  return [
    new BigNumberJs(reserves[0].toString()),
    new BigNumberJs(reserves[1].toString()),
  ];
};

function getTokensOutGivenTokensIn({
  reservesTokenIn,
  reservesTokenOut,
  tokensIn,
}: {
  reservesTokenIn: BigNumberJs;
  reservesTokenOut: BigNumberJs;
  tokensIn: BigNumberJs;
}): BigNumberJs {
  // Y = B - k / (A + X)
  const invariant = reservesTokenIn.multipliedBy(reservesTokenOut);
  return reservesTokenOut.minus(
    invariant.dividedBy(reservesTokenIn.plus(tokensIn))
  );
}

export {
  getSdogMimReserves,
  getProvider,
  getReserves,
  getTokensOutGivenTokensIn,
};
