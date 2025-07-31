import type React from "react";
import type { AuthFormProps } from "./types";
import { useState, type FormEvent } from "react";

const AuthLoginForm: React.FC<AuthFormProps> = ({
  onSubmit,
  loading,
  buttonText = "登录",
  usernamePlaceholder = "请输入用户名",
  passwordPlaceholder = "请输入密码",
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const inputClass: string =
    "w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 select-none disabled:bg-gray-100 disabled:cursor-not-allowed";
  const buttonClass: string =
    "w-full py-3 rounded-md bg-orange-400 text-white transition hover:bg-orange-500 disabled:bg-orange-200 select-none disabled:cursor-not-allowed";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 校验用户名
    if (username.length < 2 || username.length > 20) {
      setError("用户名需为2-20个字符");
      return;
    }
    // 校验密码
    if (password.length < 2 || password.length > 20) {
      setError("密码需为2-20个字符");
      return;
    }
    setError(null);
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}
      <div>
        <input
          type="text"
          value={username}
          disabled={loading}
          placeholder={usernamePlaceholder}
          className={inputClass}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          disabled={loading}
          placeholder={passwordPlaceholder}
          className={inputClass}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" disabled={loading} className={buttonClass}>
        {buttonText}
      </button>
    </form>
  );
};

export default AuthLoginForm;
