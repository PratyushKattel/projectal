import { useNavigate } from "react-router-dom";
import useWorkSpaceStore from "../store/WorkspaceStore";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Workspace = () => {
  const navigate = useNavigate();

  const workspaces = useWorkSpaceStore((state) => state.workspaces);
  const fetchWorkspaces = useWorkSpaceStore((state) => state.fetchWorkspaces);
  const loading = useWorkSpaceStore((state) => state.loading);
  const createWorkspace = useWorkSpaceStore((state) => state.createWorkspace);

  const [isOpen, setIsOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");

  useEffect(() => {
    console.log("Component mounted");
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleWorkspaceClick = (id) => {
    navigate(`/workspace/${id}`);
  };

  const handleCreate = async () => {
    if (!workspaceName.trim()) {
      return;
    }
    await createWorkspace(workspaceName);
    setWorkspaceName("");
    setIsOpen(false);

    toast.success("workspace created successfully!");
  };

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-secondary">Your Workspaces</h2>
        <button
          className="bg-primary hover:text-white hover:bg-secondary text-white px-4 py-2 rounded shadow"
          onClick={() => setIsOpen(true)}
        >
          + Create Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {workspaces.map((ws) => (
          <div
            key={ws.ws_id}
            onClick={() => handleWorkspaceClick(ws.ws_id)}
            className="cursor-pointer bg-white hover:bg-surface rounded-lg shadow-md p-5 transition transform hover:scale-105"
          >
            <h3 className="text-lg font-semibold text-primary">{ws.name}</h3>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Create Workspace</h3>

            <input
              type="text"
              placeholder="Workspace name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 rounded bg-primary text-white hover:bg-secondary"
                onClick={handleCreate}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;
