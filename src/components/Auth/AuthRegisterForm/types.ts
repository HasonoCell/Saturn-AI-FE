import type { RegisterParams } from "../../../types";

export interface AuthRegisterFormProps {
  onSubmit: (params: RegisterParams) => void;
  loading: boolean;
  buttonText?: string;
  usernamePlaceholder?: string;
  nicknamePlaceholder?: string;
  passwordPlaceholder?: string;
}
