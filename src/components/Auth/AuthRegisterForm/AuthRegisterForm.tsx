import type React from "react";
import type { AuthRegisterFormProps } from "./types";
import { useState, type FormEvent } from "react";

const AuthRegisterForm: React.FC<AuthRegisterFormProps> = ({
  onSubmit,
  loading,
  buttonText = "注册",
  usernamePlaceholder = "用户名 (2-20个字符)",
  nicknamePlaceholder = "昵称 (2-20个字符)",
  passwordPlaceholder = "密码 (2-20个字符)",
}) => {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
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
    // 校验昵称
    if (nickname.length < 2 || nickname.length > 20) {
      setError("昵称需为2-20个字符");
      return;
    }
    // 校验密码
    if (password.length < 2 || password.length > 20) {
      setError("密码需为2-20个字符");
      return;
    }

    setError(null);
    onSubmit({ username, nickname, password });
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
          onChange={(e) => setUsername(e.target.value)}
          placeholder={usernamePlaceholder}
          disabled={loading}
          className={inputClass}
        />
      </div>
      <div>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={nicknamePlaceholder}
          disabled={loading}
          className={inputClass}
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={passwordPlaceholder}
          disabled={loading}
          className={inputClass}
        />
      </div>
      <button type="submit" disabled={loading} className={buttonClass}>
        {buttonText}
      </button>
    </form>
  );
};

export default AuthRegisterForm;
