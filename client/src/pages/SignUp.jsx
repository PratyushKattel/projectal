import SignupGraph from "../components/signup/SignupGraph";
import SignupForm from "../components/signup/SignupForm";

const Signup = () => {
  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden h-screen">
      <SignupGraph />
      <SignupForm />
    </div>
  );
};

export default Signup;
