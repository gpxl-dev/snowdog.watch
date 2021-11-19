import React, { FC, ReactNode } from "react";

const LogoAndText: FC<{ logo: any; text: ReactNode }> = ({ logo, text }) => {
  return (
    <div className="flex flex-row items-center">
      <img src={logo} className="w-10 h-10 mr-4" />
      <span className="text-2xl font-normaledium text-darkGrey">{text}</span>
    </div>
  );
};

export default LogoAndText;
