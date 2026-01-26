import { useState } from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [menuClicked, setMenuClicked] = useState(false);

  return (
    <nav className="font-poppins">
      <div className="flex items-center justify-between p-3">
        <div>
          <img
            src="/images/logo.svg"
            alt="logo"
            className="h-10 md:h-12 w-auto"
          />
        </div>

        <div className="md:hidden">
          <button
            className="text-2xl"
            onClick={() => setMenuClicked(!menuClicked)}
          >
            ☰
          </button>
        </div>

        <div className="hidden md:block">
          <ul className="flex justify-center items-center gap-12 text-sm">
            <li className="hover:border-b-2 border-primary/30 transition-all duration-200 ease-in-out cursor-pointer">
              Features
            </li>

            <li className="hover:border-b-2 border-primary/30 transition-all duration-200 ease-in-out cursor-pointer">
              How it Works?
            </li>

            <li className="hover:border-b-2 border-primary/30 transition-all duration-200 ease-in-out cursor-pointer">
              About
            </li>
          </ul>
        </div>

        <div className="hidden md:flex justify-center items-center gap-10">
          <Link to="/login" className="text-primary hover:text-secondary/70 cursor-pointer font-semibold inline-block">
              Login
          </Link>
        </div>
      </div>

      <div
        className={`md:hidden bg-white border-t border-gray-200 transition-all duration-300 overflow-hidden ${
          menuClicked ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-4 py-4 text-sm">
          <li className="hover:text-primary cursor-pointer">Features</li>
          <li className="hover:text-primary cursor-pointer">How it Works?</li>
          <li className="hover:text-primary cursor-pointer">About</li>
          <button className="text-primary font-semibold">Log in</button>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
