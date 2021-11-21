import React, { FC, ReactNode } from "react";

const ConditionalText: FC<{
  condition: boolean;
  enabled: ReactNode;
  disabled: ReactNode;
}> = ({ condition, enabled, disabled }) => {
  return condition ? <>{enabled}</> : <>{disabled}</>;
};

export default ConditionalText;
