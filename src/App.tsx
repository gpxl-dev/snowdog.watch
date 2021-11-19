import { BigNumber } from "bignumber.js";
import React, { Fragment } from "react";
import { TREASURY_TOKENS } from "./api/treasury";
import Card from "./components/Card";
import LogoAndText from "./components/LogoAndText";
import useBuybackMath from "./hooks/useBuyBackMath";

import sdogLogo from "./svg/sdog.svg";
import avaxLogo from "./svg/avax.svg";
import spellLogo from "./svg/spell.svg";
import mimLogo from "./svg/mim.svg";
import wethLogo from "./svg/weth.svg";
import joeLogo from "./svg/joe.svg";
import burnLogo from "./svg/burn.svg";
import toArrow from "./svg/toArrow.svg";
import sbPepe from "./svg/sbPepe.svg";
import copyIcon from "./svg/copyIcon.svg";
import TreasuryAsset from "./components/TreasuryAsset";
import DollarValue from "./components/DollarValue";
import TokenUnitValue from "./components/TokenUnitValue";
import { copyTextToClipboard } from "./utils/copyToClipboard";

const logos: Record<TREASURY_TOKENS, string> = {
  avax: avaxLogo,
  spell: spellLogo,
  mim: mimLogo,
  weth: wethLogo,
  joe: joeLogo,
};

// Never use exponential notation when toStringing bignumbers.
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const App: React.FC = () => {
  const state = useBuybackMath();

  return (
    <div className="text-offBlack flex flex-col p-4 gap-3">
      <header className="flex flex-row items-center my-5 self-center">
        <img src={sdogLogo} className="px-2" />
        <h1 className="font-semibold text-2xl mx-3">$SDOG Calculator</h1>
      </header>
      <Card>
        <h2 className="text-xl font-bold mb-4">Current $SDOG price</h2>
        <Card internal>
          <LogoAndText
            logo={sdogLogo}
            text={<DollarValue value={state.tokenPricesInMim.sdog} />}
          />
        </Card>
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-4">Buyback Impact</h2>
        <p className="text-darkGrey text-base mb-6 leading-relaxed">
          Number of tokens bought and burned if the buyback happened now, and
          the resultant spot price of SDOG:
        </p>
        <div className="relative flex flex-col">
          <Card internal className="mb-2">
            <LogoAndText
              logo={burnLogo}
              text={
                <TokenUnitValue
                  decimals={9}
                  value={state.buybackResult?.burned || null}
                />
              }
            />
          </Card>
          <img src={toArrow} className="absolute self-center top-[5.125rem]" />
          <Card internal>
            <LogoAndText
              logo={sdogLogo}
              text={
                <DollarValue value={state.buybackResult?.priceAfter || null} />
              }
            />
          </Card>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-4">Treasury info</h2>
        <p className="text-darkGrey text-base mb-6 leading-relaxed">
          Current treasury assets excluding MIM-SDOG LP
        </p>
        {Object.keys(TREASURY_TOKENS).map((key) => {
          const symbol = key as TREASURY_TOKENS;
          const canCalculateValue =
            state.treasuryBalances[symbol] && state.tokenPricesInMim[symbol];
          return (
            <TreasuryAsset
              key={symbol}
              amount={
                <TokenUnitValue
                  decimals={18}
                  value={state.treasuryBalances[symbol]}
                />
              }
              logo={logos[symbol]}
              symbol={`$${symbol.toUpperCase()}`}
              value={
                <DollarValue
                  value={
                    canCalculateValue
                      ? state.treasuryBalances[symbol]!.dividedBy(
                          10 ** 18
                        ).multipliedBy(state.tokenPricesInMim[symbol]!)
                      : null
                  }
                />
              }
            />
          );
        })}
        <div className="w-100 border-b border-lightGrey my-6"></div>
        <div className="flex flex-row text-xl justify-between">
          <span className="font-bold">Total</span>
          <span className="font-semibold text-valueGreen">
            <DollarValue value={state.treasuryTotal} />
          </span>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <h2 className="text-xl font-bold mb-4">Honestly, SB good project</h2>
        <p className="text-darkGrey text-base mb-6 leading-relaxed">
          Calculator made with love by @greypixel &amp; @japlet - buy us a beer
          if you'd like:
        </p>
        <Card internal className="flex flex-row p-3 gap-2">
          <span className="text-darkGrey text-sm break-words overflow-hidden">
            0x0838FeF78Ea34Ff8654669281a2e8D1D96A6eE35
          </span>
          <button
            className="p-4"
            onClick={() => {
              copyTextToClipboard("0x0838FeF78Ea34Ff8654669281a2e8D1D96A6eE35");
            }}
          >
            <img src={copyIcon} className="w-5" />
          </button>
        </Card>
        <img src={sbPepe} className="ml-auto mt-10 -mr-6 -mb-8" />
      </Card>
    </div>
  );
};

export default App;
