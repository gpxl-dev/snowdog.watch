import BigNumber from "bignumber.js";
import React, { FC } from "react";
import { addCommas } from "../utils/addCommas";
import LoadingSpinner from "./LoadingSpinner";

const DollarValue: FC<{ value: BigNumber | null }> = ({ value }) => {
  if (value == null) {
    return <LoadingSpinner />;
  } else if (value.isNaN()) {
    return (
      <>
        <span className="text-red-300">Invalid params</span>
      </>
    );
  } else {
    return <>${addCommas(value.toFixed(2))}</>;
  }
};

export default DollarValue;
