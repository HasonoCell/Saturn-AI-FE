import type { LoginParams } from "../../../types/user";

export interface AuthFormProps {
  onSubmit: (params: LoginParams) => void;
  loading: boolean;
  buttonText?: string;
  usernamePlaceholder?: string;
  passwordPlaceholder?: string;
}
