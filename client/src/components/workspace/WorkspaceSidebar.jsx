import { Link, useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import useWorkSpaceStore from "../../store/WorkspaceStore";

const WorkspaceSidebar = ({ onInviteClick }) => {
  const { id } = useParams();
  const location = useLocation();
  const { currentWorkspace, fetchWorkspaceDetail } = useWorkSpaceStore();

  useEffect(() => {
    if (id) {
      fetchWorkspaceDetail(id);
    }
  }, [id]);

  const isActive = (path) => {
    return location.pathname === path ||
      (path === `/workspace/${id}` &&
        location.pathname.startsWith(`/workspace/${id}/project`))
      ? "bg-primary text-white"
      : "text-gray-700 hover:bg-background hover:text-primary";
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "owner":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "admin":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="w-64 bg-surface shadow-lg p-6 flex flex-col min-h-screen border-r border-gray-200">
      <div className="mb-6">
        <h2
          className="text-2xl font-bold text-primary font-poppins truncate"
          title={currentWorkspace?.name}
        >
          {currentWorkspace?.name || "Workspace"}
        </h2>
        {currentWorkspace?.role && (
          <div
            className={`mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getRoleBadgeColor(currentWorkspace.role)}`}
          >
            {currentWorkspace.role}
          </div>
        )}
      </div>

      {currentWorkspace?.role === "Owner" && (
        <button
          onClick={onInviteClick}
          className="mb-8 px-4 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Invite People
        </button>
      )}

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
        {/* <Link
          to={`/workspace/${id}/calendar`}
          className={`px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isActive(`/workspace/${id}/calendar`)}`}
        >
          Calendar
        </Link> */}
        <Link
          to={`/workspace/${id}/members`}
          className={`px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isActive(`/workspace/${id}/members`)}`}
        >
          Members
        </Link>
        <Link
          to={`/workspace/${id}/activity`}
          className={`px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isActive(`/workspace/${id}/activity`)}`}
        >
          Activity
        </Link>

        {/* <Link
          to={`/workspace/${id}#`}
          className="px-4 py-3 text-gray-700 hover:bg-background hover:text-primary rounded-lg transition-all duration-200 font-medium"
        >
          Settings
        </Link> */}
      </nav>
    </div>
  );
};

export default WorkspaceSidebar;
