import { useState } from "react";
import {
  AuthLayout,
  AuthLoginForm,
  AuthToggleLink,
  AuthFooter,
} from "../../components";
import { userService } from "../../services";
import { message as Message } from "antd";
import { useLocation, useNavigate } from "react-router";
import type { LoginParams } from "../../types/user";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/home";

  const handleSubmit = async (params: LoginParams) => {
    setLoading(true);
    try {
      await userService.login(params);
      // 登录成功后跳转回去
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "登录失败，请稍后重试";
      Message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="登录">
      <AuthLoginForm onSubmit={handleSubmit} loading={loading} />
      <AuthToggleLink isLogin={true} />
      <AuthFooter />
    </AuthLayout>
  );
};

export default Login;
