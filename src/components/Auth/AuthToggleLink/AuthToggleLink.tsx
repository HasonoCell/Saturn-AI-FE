import type React from "react";
import { Link } from "react-router";
import type { AuthToggleLinkProps } from "./types";

const AuthToggleLink: React.FC<AuthToggleLinkProps> = ({
  isLogin,
  loginText = "没有账户?",
  registerText = "已有账户?",
}) => {
  return (
    <div className="text-center mt-6">
      {isLogin ? (
        <>
          <span>{loginText}</span>
          <Link to="/register" className="text-orange-400 ml-3 hover:underline">
            注册
          </Link>
        </>
      ) : (
        <>
          <span>{registerText}</span>
          <Link to="/login" className="text-orange-400 ml-3 hover:underline">
            登录
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthToggleLink;
