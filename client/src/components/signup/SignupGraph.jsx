import { Link } from "react-router-dom";

const SignupGraph = () => {
  return (
    <div className="hidden lg:flex w-1/2 bg-[#2557D6] flex-col items-center justify-between p-12 text-white">
      <div className="self-start">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/images/whiteLogo.svg"
            alt="logo"
            className="h-10 md:h-12 w-auto"
          />
        </Link>
      </div>

      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl aspect-video flex items-center justify-center shadow-2xl overflow-hidden">
        <img
          src="/images/login-img.svg"
          alt="Signup Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      <p className="text-xl font-medium opacity-90 text-center">
        Start building your projects today.
      </p>
    </div>
  );
};

export default SignupGraph;
