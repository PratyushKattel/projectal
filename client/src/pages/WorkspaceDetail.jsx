import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useProjectStore from "../store/ProjectStore";
import useWorkSpaceStore from "../store/WorkspaceStore";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";

const WorkspaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Connect to the store — pull out state + actions
  const { projects, loading, fetchProjects, createProject, deleteProject } =
    useProjectStore();
  const { currentWorkspace } = useWorkSpaceStore();

  const canManageProjects =
    currentWorkspace?.role === "Owner" || currentWorkspace?.role === "Admin";

  // 2. Local state for the create modal
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // 3. Fetch projects when the component mounts (or when id changes)
  useEffect(() => {
    fetchProjects(id);
  }, [id]);

  // 4. Handle create
  const handleCreate = async () => {
    if (!projectName.trim()) return;
    try {
      await createProject(id, projectName, projectDescription);
      setProjectName("");
      setProjectDescription("");
      setIsOpen(false);
      toast.success("Project created successfully!");
    } catch (err) {
      toast.error("Failed to create project");
      console.log(err);
    }
  };

  // 5. Handle delete
  const handleDelete = async (projectId) => {
    try {
      await deleteProject(projectId);
      toast.success("Project deleted!");
    } catch (err) {
      toast.error("Failed to delete project");
      console.log(err);
    }
  };

  if (loading) {
    return (
      <WorkspaceLayout id={id}>
        <div className="flex items-center justify-center h-64 text-primary font-semibold text-lg">
          Loading projects...
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout id={id}>
      <div className="max-w-7xl mx-auto">
        {/* Header with create button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary font-poppins">
            Projects
          </h1>
          <div className="flex gap-3">
            <button
              className="border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 rounded shadow transition"
              onClick={() => navigate("/workspace")}
            >
              ← All Workspaces
            </button>
            {canManageProjects && (
              <button
                className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded shadow transition"
                onClick={() => setIsOpen(true)}
              >
                + Create Project
              </button>
            )}
          </div>
        </div>

        {/* Project cards grid */}
        {projects.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            No projects yet. Create your first one!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.proj_id}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer"
                onClick={() =>
                  navigate(`/workspace/${id}/project/${project.proj_id}`)
                }
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-primary">
                    {project.name}
                  </h3>
                  {canManageProjects && (
                    <button
                      className="text-sm text-red-500 hover:text-red-700 transition px-2 py-1 rounded hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.proj_id);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {project.description || "No description"}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Create Project
            </h3>

            <input
              type="text"
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <textarea
              placeholder="Description (optional)"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-primary text-white hover:bg-secondary transition"
                onClick={handleCreate}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
};

export default WorkspaceDetail;
