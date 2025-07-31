import { useState } from "react";
import { AuthLayout, AuthForm } from "../../components";
import { userService } from "../../services/userServices";
import { message as Message } from "antd";
import { useLocation, useNavigate } from "react-router";
import type { LoginParams } from "../../types/user";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // 获取到之前尝试访问的路径
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleSubmit = async (params: LoginParams) => {
    setLoading(true);
    try {
      await userService.login(params);
      // 登录成功后跳转回去
      navigate(from, { replace: true });
    } catch {
      // userService 里面有对 error 的处理
      Message.error("登录失败，请检查账号或密码是否有误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="登录">
      <AuthForm onSubmit={handleSubmit} loading={loading}></AuthForm>
    </AuthLayout>
  );
};

export default Login;
