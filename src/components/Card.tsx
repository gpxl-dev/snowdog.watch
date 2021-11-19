import React, { FC } from "react";
import classnames from "classnames";

const Card: FC<{ className?: string; internal?: boolean }> = ({
  children,
  className,
  internal,
}) => {
  return (
    <div
      className={classnames("rounded border border-lightGrey p-6", className, {
        "bg-offWhite": internal,
        "bg-white": !internal,
      })}
    >
      {children}
    </div>
  );
};

export default Card;
