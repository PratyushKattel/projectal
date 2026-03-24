import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const WorkspaceNav = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <div className="p-4">User not found</div>;

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img
          src="/images/logo.svg"
          alt="Logo"
          className="h-10 md:h-10 w-auto"
        />
      </div>

      {/* User Info */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-semibold text-secondary">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <button
          onClick={() => navigate("/logout")}
          className="bg-primary hover:bg-secondary text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default WorkspaceNav;
