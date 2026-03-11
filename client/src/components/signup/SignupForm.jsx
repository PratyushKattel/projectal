import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const SignupForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const data = await register(form.name, form.email, form.password);

      if (data?.message) {
        toast.success(data.message);
      } else {
        toast.success("user registered succesfully");
      }
      console.log("Signup success:", data);
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Signup failed");
      console.log("Signup failed:", err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading ....</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center px-8 md:px-16 py-6">
      <div className="w-full max-w-md">
        <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
          Create Account
        </h2>
        <p className="text-gray-500 mb-8 text-center">
          Please enter your details to get started.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Name:
            </label>
            <input
              type="text"
              placeholder="Harry Johnson"
              className="w-full px-4 py-3 rounded-xl bg-[#E8F0FE] border-none outline-none focus:ring-2 focus:ring-blue-400"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={loadingSubmit}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email:
            </label>
            <input
              type="email"
              placeholder="harryjohnson@gmail.com"
              className="w-full px-4 py-3 rounded-xl bg-[#E8F0FE] border-none outline-none focus:ring-2 focus:ring-blue-400"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={loadingSubmit}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Password:
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#E8F0FE] border-none outline-none focus:ring-2 focus:ring-blue-400"
              name="password"
              value={form.password}
              onChange={handleChange}
              disabled={loadingSubmit}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2557D6] hover:bg-[#1e46af] text-white font-bold py-3 rounded-xl transition shadow-lg"
          >
            Sign up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-4 text-xs text-gray-400 uppercase tracking-widest font-medium">
            or continue with
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Button */}
        <button
          type="button"
          className="w-full border border-gray-200 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition font-semibold text-gray-700"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            className="w-5 h-5"
            alt="google"
          />
          <span className="text-[#2557D6]">Sign up with Google</span>
        </button>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#2557D6] font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
