import { BigNumber } from "bignumber.js";
import React, { useState } from "react";
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
import useScenario from "./hooks/useScenario";
import ToggleSwitch from "./components/ToggleSwitch";
import classNames from "classnames";
import ShareModal from "./components/ShareModal";
import { addCommas } from "./utils/addCommas";

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
  const [simulationMode, setSimulationMode] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const scenario = useScenario(state, state.treasuryTotal, simulationMode);

  return (
    <>
      <div className="flex flex-col md:grid gap-3 max-w-4xl mx-auto p-4 text-offBlack gridContainer">
        <header className="area-header flex flex-col sm:flex-row items-center my-5 self-center sm:self-stretch justify-between">
          <div className="flex flex-row items-center">
            <img src={sdogLogo} className="px-2" />
            <h1 className="font-semibold text-2xl mx-3">snowdog.watch</h1>
          </div>
          <div className="flex flex-row items-center mt-6 sm:mt-0">
            <h1 className="font-light text-lg mx-3 uppercase">
              Simulation mode
            </h1>
            <ToggleSwitch
              setEnabled={setSimulationMode}
              enabled={simulationMode}
            />
          </div>
        </header>
        <Card className="area-currentPrice">
          <div className="flex flex-row justify-between flex-wrap items-center mb-4">
            <h2 className="text-xl font-bold">
              {simulationMode ? "Simulated price" : "Current price"}
            </h2>
            <a
              href="https://traderjoexyz.com/#/trade?inputCurrency=0x130966628846bfd36ff31a822705796e8cb8c18d&outputCurrency=0xdE9E52F1838951e4d2bb6C59723B003c353979b6"
              className="md:hidden block bg-sdogBlue text-white px-2 py-1 rounded text-sm"
              target="_blank"
            >
              Buy SDOG
            </a>
          </div>
          {simulationMode && (
            <p className="mb-2 text-sdogBlue">
              $SDOG Increases
              <input
                value={scenario.priceIncrease}
                onChange={(e) => scenario.setPriceIncrease(e.target.value)}
                step="0.5"
                type="number"
                className="inlineInput"
              />
              % from current price to:
            </p>
          )}
          <Card internal>
            <LogoAndText
              logo={sdogLogo}
              text={<DollarValue value={scenario.sdogPrice} />}
            />
          </Card>
          {simulationMode &&
            scenario.sdogSold.dividedBy(10 ** 9).toFixed(0) !== "0" && (
              <p className="mt-4 text-sdogBlue opacity-80 italic text-sm">
                To achieve this price, a net total of{" "}
                {addCommas(
                  scenario.sdogSold
                    .dividedBy(10 ** 9)
                    .abs()
                    .toFixed(0)
                )}{" "}
                SDOG would need to be{" "}
                {scenario.sdogSold.lt(0) ? "bought " : "sold "} between now and
                the buyback
              </p>
            )}
        </Card>

        <Card
          className={classNames("area-buybackImpact", {
            "order-1": simulationMode,
          })}
        >
          <h2 className="text-xl font-bold mb-4">
            {simulationMode
              ? "Simulated buyback impact"
              : "Theoretical buyback impact"}
          </h2>
          <p className="text-darkGrey text-base mb-6 leading-relaxed">
            {simulationMode ? (
              <span>
                Number of tokens bought and burned in the first of{" "}
                <input
                  value={scenario.numBuybacks}
                  onChange={(e) => scenario.setNumBuybacks(e.target.value)}
                  step="1"
                  type="number"
                  className="inlineInput border-b border-sdogBlue text-sdogBlue"
                />{" "}
                <span className="text-sdogBlue">
                  {parseInt(scenario.numBuybacks) == 1 ? "buyback" : "buybacks"}{" "}
                </span>
                with the simulated parameters, and the resultant{" "}
                <b>instantaneous</b> spot price of Snowdog:
              </span>
            ) : (
              <span>
                Number of tokens bought and burned if the buyback were to happen
                now <b className="font-bold">as a single transaction</b>, and
                the resultant <b>instantaneous</b> spot price of Snowdog:
              </span>
            )}
          </p>
          <div className="relative flex flex-col">
            <Card internal className="mb-2">
              <LogoAndText
                logo={burnLogo}
                text={
                  <TokenUnitValue
                    decimals={9}
                    value={scenario.sdogBurned || null}
                  />
                }
              />
            </Card>
            <img
              src={toArrow}
              className="absolute self-center top-[5.125rem]"
            />
            <Card internal>
              <LogoAndText
                logo={sdogLogo}
                text={<DollarValue value={scenario.postBuybackPrice || null} />}
              />
            </Card>
          </div>
          <a
            href="https://traderjoexyz.com/#/trade?inputCurrency=0x130966628846bfd36ff31a822705796e8cb8c18d&outputCurrency=0xdE9E52F1838951e4d2bb6C59723B003c353979b6"
            className="hidden md:block w-full p-8 text-center text-xl font-bold text-white bg-sdogBlue rounded mt-8 active:bg-blue-800 transition-colors"
            target="_blank"
          >
            Buy SDOG
          </a>
          {simulationMode && (
            <button
              className="w-full p-8 text-xl font-bold text-white bg-sdogBlue rounded mt-8 active:bg-blue-800 transition-colors"
              onClick={() => {
                setShareModalOpen(true);
              }}
            >
              Shareable summary
            </button>
          )}
        </Card>

        <Card className="area-treasury flex flex-col">
          <h2 className="text-xl font-bold mb-4">Buyback treasury info</h2>
          <p
            className="text-darkGrey text-base mb-6 leading-relaxed"
            style={{ flexGrow: 2 }}
          >
            {simulationMode
              ? "Specific assets not used in simuation mode, only total value"
              : "Current treasury assets excluding SDOG-MIM LP"}
          </p>
          {Object.keys(TREASURY_TOKENS).map((key) => {
            const symbol = key as TREASURY_TOKENS;
            const canCalculateValue =
              state.treasuryBalances[symbol] && state.tokenPricesInMim[symbol];
            return (
              <TreasuryAsset
                className={classNames("transition-opacity", {
                  "opacity-30": simulationMode,
                })}
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
          <div className="w-100 border-b border-lightGrey mt-4 mb-6 flex-1"></div>
          {simulationMode && (
            <p className="mb-4 text-sdogBlue">
              Value of the Snowdog treasury (excluding SD-MIM LP tokens)
              increases by
              <input
                value={scenario.treasuryValueIncrease}
                onChange={(e) =>
                  scenario.setTreasuryValueIncrease(e.target.value)
                }
                step="0.5"
                type="number"
                className="inlineInput"
              />
              % from its current value to:
            </p>
          )}
          <div className="flex flex-row text-xl justify-between">
            <span className="font-bold">Total</span>
            <span className="font-semibold text-valueGreen">
              <DollarValue value={scenario.treasuryValue} />
            </span>
          </div>
          {simulationMode && (
            <p className="mt-4 text-sdogBlue opacity-80 italic text-sm">
              <b className="font-bold">NOTE:</b> Treasury value can only
              increase significantly when minting is active. Changes after the
              minting period could only occur as a result of tokens within the
              treasury changing in $ value
            </p>
          )}
        </Card>

        <Card className="area-liquidity flex flex-col">
          <h2 className="text-xl font-bold mb-4">
            {simulationMode
              ? "Simulated liquidity pool info"
              : "Liquidity pool info"}
          </h2>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-1 flex-wrap flex-row gap-3 items-center">
              <img src={sdogLogo} className="w-8 h-8" />
              <h4 className="font-semibold text-black">
                <TokenUnitValue
                  decimals={0}
                  renderDecimals={0}
                  value={
                    scenario.sdogPrice && scenario.lpValueInMim
                      ? scenario.lpValueInMim
                          .dividedBy(10 ** 18)
                          .dividedBy(2)
                          .dividedBy(scenario.sdogPrice)
                      : null
                  }
                />
              </h4>
            </div>
            <h4 className="font-semibold text-black"> = </h4>
            <div className="flex flex-1 flex-wrap flex-row-reverse gap-3 items-center">
              <img src={mimLogo} className="w-8 h-8" />
              <h4 className="font-semibold text-black">
                <TokenUnitValue
                  decimals={18}
                  renderDecimals={0}
                  value={scenario.lpValueInMim.dividedBy(2) || null}
                />
              </h4>
            </div>
          </div>
          <div className="w-100 border-b border-lightGrey mt-6 mb-4 flex-1" />
          <div className="flex flex-col">
            {simulationMode && (
              <p className="mb-4 text-sdogBlue">
                Total value of tokens in the SDOG-MIM liquidity pool increases
                by
                <input
                  value={scenario.lpSizeIncrease}
                  onChange={(e) => scenario.setLpSizeIncrease(e.target.value)}
                  step="0.5"
                  type="number"
                  className="inlineInput"
                />
                % from current value to:
              </p>
            )}
            <div className="flex flex-row  text-lg justify-between">
              <span className="font-bold">Total value</span>
              <span className="font-semibold text-valueGreen">
                <DollarValue
                  value={scenario.lpValueInMim.dividedBy(10 ** 18) || null}
                />
              </span>
            </div>
            {simulationMode && (
              <p className="mt-4 text-sdogBlue opacity-80 italic text-sm">
                <b className="font-bold">NOTE:</b> The treasury value above is
                calculated by assuming the price you have selected has been
                reached by current holders selling SDOG to the pool. Adjusting
                the value modifier is essentially simulating people adding or
                removing liquidity from the Trader Joe pool. At the time of
                publishing (end of day 6), SDOG owns &gt;99% of the LP, so a
                negative value here is very unlikely
              </p>
            )}
          </div>
        </Card>

        <Card className="area-footer flex flex-col md:flex-row overflow-hidden order-2">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold mb-4">
              Honestly, SB good project
            </h2>
            <p className="text-darkGrey text-base mb-6 leading-relaxed">
              Calculator made with ❤️ by{" "}
              <a
                href="https://twitter.com/greypixel_"
                target="_blank"
                className="underline"
              >
                @greypixel_
              </a>{" "}
              &amp;{" "}
              <a href="https://twitter.com/japlito" className="underline">
                @japlito
              </a>
              &nbsp;- buy us a beer if you'd like:
            </p>
            <Card
              internal
              className="flex flex-row !px-3 !py-1 gap-2 items-center justify-between"
            >
              <span className="text-darkGrey text-sm break-words overflow-hidden">
                0x0838FeF78Ea34Ff8654669281a2e8D1D96A6eE35
              </span>
              <button
                className="p-4"
                onClick={() => {
                  copyTextToClipboard(
                    "0x0838FeF78Ea34Ff8654669281a2e8D1D96A6eE35"
                  );
                }}
              >
                <img src={copyIcon} className="w-5" />
              </button>
            </Card>
          </div>
          <img src={sbPepe} className="ml-auto mt-10 -mr-6 -mb-8 md:-mb-12" />
        </Card>
        {/* <Card>
        <label>
          Price multiplier
          <Card internal>
            <input
              type="text"
              value={scenario.priceModifier}
              onChange={(e) => scenario.setPriceModifier(e.target.value)}
            />
          </Card>
        </label>
        <label>
          Treasury multiplier
          <Card internal>
            <input
              type="text"
              value={scenario.treasuryValueModifier}
              onChange={(e) =>
                scenario.setTreasuryValueModifier(e.target.value)
              }
            />
          </Card>
        </label>
        <label>
          LP size modifier
          <Card internal>
            <input
              type="text"
              value={scenario.lpSizeModifier}
              onChange={(e) => scenario.setLpSizeModifier(e.target.value)}
            />
          </Card>
        </label>
        <label>
          Buybacks
          <Card internal>
            <input
              type="text"
              value={scenario.numBuybacks}
              onChange={(e) => scenario.setNumBuybacks(e.target.value)}
            />
          </Card>
        </label>
      </Card> */}

        <div className="area-disclaimer text-sm text-darkGrey mt-5 order-last">
          Disclaimer: Honestly, SB good project, but we're not affiliated in any
          way with Snowdog or Snowbank. We've never even spoken to the regional
          manager, let alone the big dog. Everything on this site is potentially
          completely wrong, and you should by no means use it as any sort of
          price guarantee or promise. Thx.
        </div>
      </div>
      <ShareModal
        isOpen={shareModalOpen}
        setIsOpen={setShareModalOpen}
        priceIncrease={scenario.priceIncrease}
        liquidityIncrease={scenario.lpSizeIncrease}
        numBuybacks={scenario.numBuybacks}
        treasuryIncrease={scenario.treasuryValueIncrease}
        treasuryValue={scenario.treasuryValue}
        liquidityValue={scenario.lpValueInMim.dividedBy(10 ** 18)}
        sdogPrice={scenario.sdogPrice || new BigNumber(0)}
        finalValue={scenario.postBuybackPrice || new BigNumber(0)}
      />
    </>
  );
};

export default App;
