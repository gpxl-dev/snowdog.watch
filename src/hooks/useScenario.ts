import BigNumber from "bignumber.js";
import { useState } from "react";
import { getTokensOutGivenTokensIn } from "../api/traderJoe";
import { BuyBackInfo } from "./useBuyBackMath";

const useScenario = (
  state: BuyBackInfo,
  treasuryValue: BigNumber,
  enable: boolean
) => {
  const [priceIncrease, setPriceIncrease] = useState<string>("0");
  const [treasuryValueIncrease, setTreasuryValueIncrease] =
    useState<string>("0");
  const [lpSizeIncrease, setLpSizeIncrease] = useState<string>("0");
  const [numBuybacks, setNumBuybacks] = useState<string>("1");

  const priceModifier = (parseFloat(priceIncrease) + 100) / 100;
  const treasuryValueModifier = (parseFloat(treasuryValueIncrease) + 100) / 100;
  const lpSizeModifier = (parseFloat(lpSizeIncrease) + 100) / 100;

  if (
    !state.tokenPricesInMim.sdog ||
    !state.reserves["sdog-mim"] ||
    !treasuryValue ||
    !enable
  )
    return {
      treasuryValue: treasuryValue,
      sdogPrice: state.tokenPricesInMim.sdog,
      lpValueInMim: (
        state.reserves["sdog-mim"]?.[1] || new BigNumber(0)
      ).multipliedBy(2),
      postBuybackPrice: state.buybackResult?.priceAfter,
      sdogBurned: state.buybackResult?.burned,
      priceIncrease,
      treasuryValueIncrease,
      lpSizeIncrease,
      numBuybacks,
      setPriceIncrease,
      setTreasuryValueIncrease,
      setLpSizeIncrease,
      setNumBuybacks,
      sdogBought: new BigNumber(0),
    };

  const poolInvariant = state.reserves["sdog-mim"]![0].multipliedBy(
    state.reserves["sdog-mim"]![1]
  );
  const newPrice = state.tokenPricesInMim.sdog.multipliedBy(priceModifier);
  const newSdogReservesForNewPrice = poolInvariant
    .dividedBy(newPrice.multipliedBy(10 ** 9))
    .squareRoot();
  const sdogBought = newSdogReservesForNewPrice.minus(
    state.reserves["sdog-mim"][0]
  );
  const newMimReservesForNewPrice = poolInvariant.dividedBy(
    newSdogReservesForNewPrice
  );
  const newTreasuryValue = treasuryValue.multipliedBy(treasuryValueModifier);
  // MIM value = SDOG value
  const oldLPValue = newMimReservesForNewPrice.multipliedBy(2);
  const newLPValue = oldLPValue.multipliedBy(lpSizeModifier);
  const newMimReserves = newLPValue.dividedBy(2);
  // mim / sdog = price || sdog * price = mim || sdog = mim / price
  const newSdogReserves = newMimReserves
    .dividedBy(10 ** 18)
    .dividedBy(newPrice)
    .multipliedBy(10 ** 9);

  const newSdogBurned = getTokensOutGivenTokensIn({
    reservesTokenIn: newMimReserves,
    reservesTokenOut: newSdogReserves,
    tokensIn: newTreasuryValue.multipliedBy(10 ** 18).dividedBy(numBuybacks),
  });

  const newPostBuyBackPrice = newMimReserves
    .plus(newTreasuryValue.multipliedBy(10 ** 18).dividedBy(numBuybacks))
    .dividedBy(10 ** 18)
    .dividedBy(newSdogReserves.minus(newSdogBurned).dividedBy(10 ** 9));

  return {
    treasuryValue: newTreasuryValue,
    sdogPrice: newPrice,
    lpValueInMim: newLPValue,
    postBuybackPrice: newPostBuyBackPrice,
    sdogBurned: newSdogBurned,
    priceIncrease,
    treasuryValueIncrease,
    lpSizeIncrease,
    numBuybacks,
    setPriceIncrease,
    setTreasuryValueIncrease,
    setLpSizeIncrease,
    setNumBuybacks,
    sdogBought,
  };
};

export default useScenario;
