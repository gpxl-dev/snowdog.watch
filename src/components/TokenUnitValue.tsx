import BigNumber from "bignumber.js";
import React, { FC } from "react";
import { addCommas } from "../utils/addCommas";
import LoadingSpinner from "./LoadingSpinner";

const TokenUnitValue: FC<{ value: BigNumber | null; decimals: number }> = ({
  value,
  decimals,
}) => {
  if (value != null) {
    return <>{addCommas(value.dividedBy(10 ** decimals).toFixed(4))}</>;
  } else {
    return <LoadingSpinner />;
  }
};

export default TokenUnitValue;
