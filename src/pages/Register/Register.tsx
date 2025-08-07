import { useState } from "react";
import {
  AuthLayout,
  AuthRegisterForm,
  AuthToggleLink,
  AuthFooter,
} from "../../components";
import { userService } from "../../services";
import type { RegisterParams } from "../../types/user";
import { message as Message } from "antd";
import { useNavigate } from "react-router";

const Register = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (params: RegisterParams) => {
    setLoading(true);
    try {
      await userService.register(params);
      navigate("/login", { replace: true });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "注册失败，请稍后重试";
      Message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="注册">
      <AuthRegisterForm onSubmit={handleSubmit} loading={loading} />
      <AuthToggleLink isLogin={false} />
      <AuthFooter />
    </AuthLayout>
  );
};

export default Register;
