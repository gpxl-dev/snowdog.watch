import React, { FC } from "react";
import { Switch } from "@headlessui/react";

const ToggleSwitch: FC<{
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ enabled, setEnabled }) => {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${
        enabled ? "bg-sdogBlue" : "bg-gray-200"
      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors -mt-0.5`}
    >
      <span className="sr-only">Enable notifications</span>
      <span
        className={`${
          enabled ? "translate-x-6" : "translate-x-1"
        } transition-transform inline-block w-4 h-4 transform bg-white rounded-full`}
      />
    </Switch>
  );
};

export default ToggleSwitch;
