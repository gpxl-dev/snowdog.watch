import React, { FC } from "react";
import { Dialog } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import { FiLink2 } from "react-icons/fi";
import BigNumber from "bignumber.js";
import { addCommas } from "../utils/addCommas";

const ShareModal: FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  priceIncrease: string;
  liquidityIncrease: string;
  treasuryIncrease: string;
  numBuybacks: string;
  sdogPrice: BigNumber;
  treasuryValue: BigNumber;
  liquidityValue: BigNumber;
  finalValue: BigNumber;
}> = ({
  isOpen,
  setIsOpen,
  priceIncrease,
  treasuryIncrease,
  liquidityIncrease,
  numBuybacks,
  liquidityValue,
  sdogPrice,
  treasuryValue,
  finalValue,
}) => {
  const singleBuyback = numBuybacks === "1";
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <div className="flex md:items-center justify-center min-h-screen">
        <div className="relative w-screen h-screen justify-center md:w-auto md:mx-auto md:h-auto flex flex-col bg-sdogBlue text-offWhite p-8 rounded md:max-w-md">
          <Dialog.Title className={"font-bold text-lg mb-4"}>
            Snowdog day 8 buyback scenario
          </Dialog.Title>
          <p className="font-extralight leading-relaxed">
            If the <b>price of $SDOG increases by {priceIncrease}%</b> from its
            current value to ${sdogPrice.toFixed(0)},
            <b> the value of the treasury grows by {treasuryIncrease}%</b> from
            its current value to $
            {(parseInt(treasuryValue.toFixed(0)) / 10 ** 6).toFixed(1)}
            M, and the value of the{" "}
            <b>liquidity in the pool increases by {liquidityIncrease}%</b>, then{" "}
            {singleBuyback ? (
              <b>{" a buyback as a single transaction "}</b>
            ) : (
              <span>
                <b>{` assuming ${numBuybacks} buyback transactions`}</b>, the
                first transaction{" "}
              </span>
            )}
            would instantaneously increase the price of $SDOG in the SDOG-MIM
            pool to:
          </p>
          <p className="self-center text-xl font-bold my-4">
            ${addCommas(finalValue.toFixed(2))}
          </p>
          <button
            className="absolute top-3 right-3 text-lg"
            onClick={() => setIsOpen(false)}
          >
            <IoMdClose />
          </button>
          <Dialog.Description
            className={
              "text-xs self-end relative top-4 left-4 italic opacity-60"
            }
          >
            Values relative to {new Date().toLocaleString()}
          </Dialog.Description>
          <span
            className={
              "text-xs self-end absolute bottom-4 left-4 flex flex-row items-center"
            }
          >
            <FiLink2 className="mr-2" />
            snowdog.watch
          </span>
        </div>
      </div>
    </Dialog>
  );
};

export default ShareModal;
