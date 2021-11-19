import { BigNumber } from "bignumber.js";
import React, { useEffect, useReducer, Fragment } from "react";
import {
  getProvider,
  getSdogMimReserves,
  getTokensOutGivenTokensIn,
} from "./api/traderJoe";
import {
  getTokenPrice,
  getTreasuryTokenBalance,
  mimTokenPools,
  TREASURY_TOKENS,
} from "./api/treasury";
import useBuybackMath from "./hooks/useBuyBackMath";

// Never use exponential notation when toStringing bignumbers.
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const App: React.FC = () => {
  const state = useBuybackMath();

  return (
    <div className="h-screen bg-gray-900 text-gray-200 flex items-center justify-center font-mono">
      <pre className="font-mono">
        SDOG price now: ${state.tokenPricesInMim.sdog?.toFixed(2) || "loading"}
        <br />
        <br />
        -- Treasury to be used for buyback --
        <br />
        {Object.keys(state.treasuryBalances).map((key) => {
          const symbol = key as TREASURY_TOKENS;
          const balance = state.treasuryBalances[symbol]?.dividedBy(10 ** 18);
          let price = state.tokenPricesInMim[symbol];
          const loading = !balance || !price;
          return (
            <Fragment key={symbol}>
              <br />
              {symbol}:{" "}
              {loading ? (
                "loading"
              ) : (
                <>
                  {balance.toFixed(4)} ($
                  {price!.multipliedBy(balance).toFixed(2)}){" "}
                </>
              )}
            </Fragment>
          );
        })}
        <br />
        <br />
        <span className="font-bold">
          TOTAL: ${state.treasuryTotal.toFixed(2)}
        </span>
        <br />
        <br />
        {state.buybackResult && (
          <>
            <span>-- Buyback impact --</span>
            <br />
            Tokens burned:{" "}
            {state.buybackResult?.burned.dividedBy(10 ** 9).toFixed(2)}
            <br />
            SDOG price after buyback: $
            {state.buybackResult?.priceAfter.toFixed(2)}
          </>
        )}
      </pre>
    </div>
  );
};

export default App;
