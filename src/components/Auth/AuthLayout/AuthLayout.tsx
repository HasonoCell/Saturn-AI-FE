import type { AuthLayoutProps } from "./types";

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-16 px-4">
      <header className="absolute top-6 left-6">
        <h1 className="font-bold text-xl">🪐Saturn AI</h1>
      </header>

      <div className="w-full max-w-xs mt-32">
        <h1 className="text-2xl font-bold text-center mb-8">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
