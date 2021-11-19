import React, { FC } from "react";

import sdog from "../svg/sdog.svg";

const LoadingSpinner: FC<{}> = ({}) => {
  return <span className="text-lightGrey font-extralight">Loading...</span>;
  // return <img src={sdog} className="animate-spin w-4 h-4" />;
};

export default LoadingSpinner;
