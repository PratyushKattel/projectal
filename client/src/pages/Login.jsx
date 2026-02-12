import React from "react";
import LoginGraph from "../components/login/LoginGraph";
import LoginForm from "../components/login/LoginForm";

const Login = () => {
  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden h-screen">
      <LoginGraph className="flex-1 max-w-[50%] hidden lg:block" />
      <LoginForm />
    </div>
  );
};

export default Login;
