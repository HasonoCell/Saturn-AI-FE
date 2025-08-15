import type React from "react";
import type { AILogoProps } from "./types";

const AILogo: React.FC<AILogoProps> = ({ larger = false }) => {
  return larger ? (
    <img src="/Saturn-AI.png" alt="Saturn-AI Logo" className="w-14 h-14" />
  ) : (
    <img src="/Saturn-AI.png" alt="Saturn-AI Logo" className="w-8 h-8" />
  );
};

export default AILogo;
