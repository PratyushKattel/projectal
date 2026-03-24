import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-gray-500 text-lg">Page not found</p>
      <Link to="/" className="text-primary font-semibold hover:underline">
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;