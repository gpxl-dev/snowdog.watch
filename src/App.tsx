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

// Never use exponential notation when toStringing bignumbers.
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

type PageState = {
  reserves: {
    [pair: string]: [BigNumber, BigNumber] | null;
  };
  tokenPricesInMim: {
    [tokenSymbol: string]: BigNumber | null;
  };
  treasuryBalances: Record<TREASURY_TOKENS, BigNumber | null>;
  buybackResult: {
    burned: BigNumber;
    priceAfter: BigNumber;
  } | null;
};

type ActionType =
  | {
      type: "setReserves";
      payload: { pair: string; reserves: [BigNumber, BigNumber] };
    }
  | {
      type: "setTokenPriceInMim";
      payload: { symbol: string; price: BigNumber };
    }
  | {
      type: "setTreasuryAssetBalance";
      payload: { symbol: string; balance: BigNumber };
    }
  | {
      type: "setBuybackResult";
      payload: { burned: BigNumber; priceAfter: BigNumber };
    };

const initialState: PageState = {
  reserves: {},
  tokenPricesInMim: {},
  treasuryBalances: {
    mim: null,
    avax: null,
    joe: null,
    spell: null,
    weth: null,
  },
  buybackResult: null,
};

const reducer: (state: PageState, action: ActionType) => PageState = (
  state,
  action
) => {
  switch (action.type) {
    case "setTokenPriceInMim":
      return {
        ...state,
        tokenPricesInMim: {
          ...state.tokenPricesInMim,
          [action.payload.symbol]: action.payload.price,
        },
      };
    case "setReserves":
      return {
        ...state,
        reserves: {
          [action.payload.pair]: action.payload.reserves,
        },
      };
    case "setTreasuryAssetBalance":
      return {
        ...state,
        treasuryBalances: {
          ...state.treasuryBalances,
          [action.payload.symbol]: action.payload.balance,
        },
      };
    case "setBuybackResult":
      return {
        ...state,
        buybackResult: action.payload,
      };
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const provider = getProvider();

    // Get the SDOG reserves (and hence price)
    getSdogMimReserves(provider).then(({ sdogReserves, mimReserves }) => {
      dispatch({
        type: "setReserves",
        payload: { pair: "sdog-mim", reserves: [sdogReserves, mimReserves] },
      });
      dispatch({
        type: "setTokenPriceInMim",
        payload: {
          symbol: "sdog",
          price: mimReserves
            .dividedBy(10 ** 18)
            .dividedBy(sdogReserves.dividedBy(10 ** 9)),
        },
      });
    });

    let avaxTokenPromise: Promise<BigNumber>;
    // Get prices in MIM for tokens that have MIM / Token pools
    mimTokenPools.forEach((key) => {
      const symbol = key as TREASURY_TOKENS;
      const promise = getTokenPrice(symbol, provider).then((price) => {
        dispatch({ type: "setTokenPriceInMim", payload: { symbol, price } });
        return price;
      });
      if (symbol === TREASURY_TOKENS.avax) {
        avaxTokenPromise = promise;
      }
    });

    Object.keys(TREASURY_TOKENS).forEach((key) => {
      const symbol = key as TREASURY_TOKENS;
      getTreasuryTokenBalance(symbol, provider).then((balance) => {
        dispatch({
          type: "setTreasuryAssetBalance",
          payload: { symbol, balance },
        });
      });
    });

    Promise.all([
      getTokenPrice(TREASURY_TOKENS.spell, provider),
      avaxTokenPromise!,
    ]).then(([spellPriceInAvax, avaxPriceInMim]) => {
      const spellPriceInMim = spellPriceInAvax.multipliedBy(avaxPriceInMim);
      dispatch({
        type: "setTokenPriceInMim",
        payload: { symbol: TREASURY_TOKENS.spell, price: spellPriceInMim },
      });
    });

    Promise.all([
      getTokenPrice(TREASURY_TOKENS.weth, provider),
      avaxTokenPromise!,
    ]).then(([avaxPriceInWeth, avaxPriceInMim]) => {
      const wethPriceInAvax = new BigNumber(1).dividedBy(avaxPriceInWeth);
      const wethPriceInMim = wethPriceInAvax.multipliedBy(avaxPriceInMim);
      dispatch({
        type: "setTokenPriceInMim",
        payload: { symbol: TREASURY_TOKENS.weth, price: wethPriceInMim },
      });
    });
  }, []);

  const treasuryTotal = Object.keys(state.treasuryBalances).reduce(
    (acc, key) => {
      const symbol = key as TREASURY_TOKENS;
      const balance = state.treasuryBalances[symbol]?.dividedBy(10 ** 18);
      let price = state.tokenPricesInMim[symbol];
      if (price && balance) {
        return acc.plus(price.multipliedBy(balance));
      } else return acc;
    },
    new BigNumber(0)
  );

  useEffect(() => {
    if (
      Object.keys(state.treasuryBalances).every((key) => {
        const symbol = key as TREASURY_TOKENS;
        return state.tokenPricesInMim[symbol] && state.treasuryBalances[symbol];
      }) &&
      state.reserves["sdog-mim"]
    ) {
      const [sdogReserves, mimReserves] = state.reserves["sdog-mim"];
      const burned = getTokensOutGivenTokensIn({
        reservesTokenIn: mimReserves,
        reservesTokenOut: sdogReserves,
        tokensIn: treasuryTotal.multipliedBy(10 ** 18),
      });
      const priceAfter = mimReserves
        .plus(treasuryTotal.multipliedBy(10 ** 18))
        .dividedBy(10 ** 18)
        .dividedBy(sdogReserves.minus(burned).dividedBy(10 ** 9));
      dispatch({
        type: "setBuybackResult",
        payload: { burned, priceAfter },
      });
    }
  }, [state.tokenPricesInMim, state.treasuryBalances, state.reserves]);

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
        <span className="font-bold">TOTAL: ${treasuryTotal.toFixed(2)}</span>
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
