const AuthFooter = () => {
  return (
    <div className="mt-8 text-center text-sm">
      <a
        href="https://www.example.com/terms"
        className="text-orange-400 hover:underline"
      >
        使用条款
      </a>
      <span className="mx-2">|</span>
      <a
        href="https://www.example.com/privacy"
        className="text-orange-400 hover:underline"
      >
        隐私政策
      </a>
    </div>
  );
};

export default AuthFooter;
