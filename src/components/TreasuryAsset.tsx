import classNames from "classnames";
import React, { FC, ReactNode } from "react";

const TreasuryAsset: FC<{
  logo: any;
  symbol: ReactNode;
  amount: ReactNode;
  value: ReactNode;
  className?: string;
}> = ({ logo, symbol, amount, value, className }) => {
  return (
    <div
      className={classNames(
        "grid grid-cols-2 grid-rows-2 text-base",
        className
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <img src={logo} className="w-8 h-8" />
        <h4 className="font-semibold text-black">{symbol}</h4>
      </div>
      <span className="text-darkGrey justify-end text-right">{amount}</span>
      <span>&nbsp;</span>
      <span className="text-valueGreen font-semibold text-right relative -top-2">
        {value}
      </span>
    </div>
  );
};

export default TreasuryAsset;
