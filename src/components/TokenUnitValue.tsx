import BigNumber from "bignumber.js";
import React, { FC } from "react";
import { addCommas } from "../utils/addCommas";
import LoadingSpinner from "./LoadingSpinner";

const TokenUnitValue: FC<{
  value: BigNumber | null;
  decimals: number;
  renderDecimals?: number;
}> = ({ value, decimals, renderDecimals: decimalPlaces = 4 }) => {
  if (value == null) {
    return <LoadingSpinner />;
  } else if (value.isNaN()) {
    return (
      <>
        <span className="text-red-300">Invalid params</span>
      </>
    );
  } else {
    return (
      <>{addCommas(value.dividedBy(10 ** decimals).toFixed(decimalPlaces))}</>
    );
  }
};

export default TokenUnitValue;
