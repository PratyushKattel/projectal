import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useTaskStore from "../store/TaskStore";
import useProjectStore from "../store/ProjectStore";
import useWorkSpaceStore from "../store/WorkspaceStore";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import TaskModal from "../components/tasks/TaskModal";

const ProjectDetail = () => {
  const { id, projId } = useParams();
  const navigate = useNavigate();

  const { tasks, loading, fetchTasks, createTask, deleteTask, updateTask } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();
  const { members, getWorkspaceMembers, currentWorkspace } = useWorkSpaceStore();
  
  const canManageTasks = currentWorkspace?.role === "Owner" || currentWorkspace?.role === "Admin";

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // States for creating task
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Todo");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  const project = projects.find((p) => String(p.proj_id) === String(projId));

  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects(id);
    }
    fetchTasks(projId);
    if (!members || members.length === 0) {
      getWorkspaceMembers(id);
    }
  }, [id, projId, getWorkspaceMembers, fetchProjects, fetchTasks, projects.length, members]);

  const handleCreateTask = async () => {
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }
    const taskData = {
      title,
      description,
      status,
      priority,
      due_date: dueDate ? dueDate : null,
      assigned_to: assignedTo ? parseInt(assignedTo) : null,
    };

    try {
      await createTask(projId, taskData);
      toast.success("Task created!");
      setIsCreateOpen(false);
      resetTaskForm();
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  const resetTaskForm = () => {
    setTitle("");
    setDescription("");
    setStatus("Todo");
    setPriority("Medium");
    setDueDate("");
    setAssignedTo("");
  };

  const handleDeleteTask = async (taskId, e) => {
    e.stopPropagation();
    try {
      await deleteTask(taskId);
      toast.success("Task deleted!");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Todo": return "bg-gray-100 text-gray-800";
      case "InProgress": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "Blocked": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "text-gray-500 bg-gray-100";
      case "Medium": return "text-blue-500 bg-blue-100";
      case "High": return "text-orange-500 bg-orange-100";
      case "Critical": return "text-red-600 bg-red-100 border border-red-200";
      default: return "text-gray-500 bg-gray-100";
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      const priorityA = priorityOrder[a.priority] || 0;
      const priorityB = priorityOrder[b.priority] || 0;
      return priorityB - priorityA; 
    } else if (sortBy === "dueDate") {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date) - new Date(b.due_date); 
    } else {
      return b.created_at && a.created_at ? new Date(b.created_at) - new Date(a.created_at) : 0; 
    }
  });

  return (
    <WorkspaceLayout id={id}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <button
              onClick={() => navigate(`/workspace/${id}`)}
              className="text-sm text-gray-500 hover:text-primary mb-2 flex items-center transition-colors"
            >
              ← Back to Projects
            </button>
            <h1 className="text-3xl font-bold text-primary font-poppins">
              {project ? project.name : "Project Details"}
            </h1>
            {project && <p className="text-gray-600 mt-1">{project.description}</p>}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">
              <span className="text-sm font-medium text-gray-700">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-none bg-transparent text-sm focus:ring-0 text-gray-800 font-medium cursor-pointer outline-none"
              >
                <option value="createdAt">Date Created</option>
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>
            {canManageTasks && (
              <button
                className="bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-lg shadow-md transition-all duration-200 transform hover:-translate-y-0.5 whitespace-nowrap"
                onClick={() => setIsCreateOpen(true)}
              >
                + Add Task
              </button>
            )}
          </div>
        </div>

        {/* Tasks grid */}
        {loading && tasks.length === 0 ? (
          <div className="flex justify-center p-12 text-primary font-medium text-lg">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-gray-400 mb-4 text-6xl">📋</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No tasks yet</h3>
            <p className="text-gray-500 mb-6">Create the first task to get this project moving!</p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="text-primary hover:text-secondary font-medium outline-none"
            >
              Create a Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedTasks.map((task) => (
              <div
                key={task.task_id}
                className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col group relative"
                onClick={() => {
                  setSelectedTask(task);
                  setIsTaskModalOpen(true);
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </div>
                  {canManageTasks && (
                    <button
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors opacity-0 group-hover:opacity-100"
                      onClick={(e) => handleDeleteTask(task.task_id, e)}
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2" title={task.title}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                  {task.description || <span className="italic text-gray-400">No description</span>}
                </p>

                <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-50">
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                  {task.due_date && (
                    <span className="text-xs text-gray-500 font-medium">
                      Due: {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Task Form Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 font-poppins">Create New Task</h2>
              <button 
                onClick={() => {
                  setIsCreateOpen(false);
                  resetTaskForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="E.g., Design homepage UI"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Add details about this task..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"
                    >
                      <option value="Todo">Todo</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                    <select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"
                    >
                      <option value="">Unassigned</option>
                      {members && members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.username || member.email}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
              <button
                className="px-5 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors font-medium border border-transparent"
                onClick={() => {
                  setIsCreateOpen(false);
                  resetTaskForm();
                }}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-secondary transition-colors shadow-sm font-medium"
                onClick={handleCreateTask}
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal and Messaging */}
      {isTaskModalOpen && selectedTask && (
        <TaskModal 
          task={selectedTask} 
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }} 
          onUpdate={(updatedData) => {
            updateTask(selectedTask.task_id, updatedData);
            setSelectedTask({ ...selectedTask, ...updatedData });
          }}
        />
      )}
    </WorkspaceLayout>
  );
};

export default ProjectDetail;
