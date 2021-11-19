import BigNumber from "bignumber.js";
import React, { FC } from "react";
import { addCommas } from "../utils/addCommas";
import LoadingSpinner from "./LoadingSpinner";

const DollarValue: FC<{ value: BigNumber | null }> = ({ value }) => {
  if (value != null) {
    return <>${addCommas(value.toFixed(2))}</>;
  } else {
    return <LoadingSpinner />;
  }
};

export default DollarValue;
