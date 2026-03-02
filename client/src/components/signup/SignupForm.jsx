import { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/apiFetch";
import { toast } from "react-toastify";

const SignupForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await apiFetch("/api/register/", {
        method: "POST",
        body: JSON.stringify(form),
      });

      toast.success(data.message);
      console.log("Signup success:", data);
    } catch (error) {
      console.log("Signup failed:", error.message);
    }
  };

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
