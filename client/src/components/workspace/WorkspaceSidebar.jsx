import { Link, useParams, useLocation } from "react-router-dom";

const WorkspaceSidebar = ({ onInviteClick }) => {
  const { id } = useParams();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || (path === `/workspace/${id}` && location.pathname.startsWith(`/workspace/${id}/project`)) 
      ? "bg-primary text-white" 
      : "text-gray-700 hover:bg-background hover:text-primary";
  };

  return (
    <div className="w-64 bg-surface shadow-lg p-6 flex flex-col min-h-screen border-r border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-primary font-poppins">
        Workspace
      </h2>

      <button
        onClick={onInviteClick}
        className="mb-8 px-4 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        Invite People
      </button>

      <nav className="flex flex-col space-y-2 flex-1">
        <Link
          to={`/workspace/${id}`}
          className={`px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isActive(`/workspace/${id}`)}`}
        >
          Projects
        </Link>
        <Link
          to={`/workspace/${id}/tasks`}
          className={`px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isActive(`/workspace/${id}/tasks`)}`}
        >
          Tasks
        </Link>
        <Link
          to={`/workspace/${id}/calendar`}
          className={`px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isActive(`/workspace/${id}/calendar`)}`}
        >
          Calendar
        </Link>
        <Link
          to={`/workspace/${id}#`}
          className="px-4 py-3 text-gray-700 hover:bg-background hover:text-primary rounded-lg transition-all duration-200 font-medium"
        >
          Settings
        </Link>
      </nav>
    </div>
  );
};

export default WorkspaceSidebar;
