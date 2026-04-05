import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import useProjectStore from "../store/ProjectStore";
import { getTasks } from "../components/api/taskApi";
import { toast } from "react-toastify";
import TaskModal from "../components/tasks/TaskModal";
import useTaskStore from "../store/TaskStore";
import useWorkSpaceStore from "../store/WorkspaceStore";

const WorkspaceTasks = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, fetchProjects, loading: projLoading } = useProjectStore();
  const { updateTask, deleteTask } = useTaskStore();
  const { currentWorkspace } = useWorkSpaceStore();
  
  const canManageTasks = currentWorkspace?.role === "Owner" || currentWorkspace?.role === "Admin";
  
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");

  useEffect(() => {
    const fetchAllTasks = async () => {
      setLoading(true);
      try {
        let currentProjects = projects;
        if (currentProjects.length === 0) {
          await useProjectStore.getState().fetchProjects(id); 
          currentProjects = useProjectStore.getState().projects;
        }
        
        const taskPromises = currentProjects.map(proj => getTasks(proj.proj_id));
        const results = await Promise.all(taskPromises);
        
        let aggregatedTasks = [];
        results.forEach((res, index) => {
          const projTasks = (res.tasks || []).map(t => ({
            ...t,
            projectName: currentProjects[index].name,
            projId: currentProjects[index].proj_id
          }));
          aggregatedTasks = [...aggregatedTasks, ...projTasks];
        });
        
        aggregatedTasks.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
        setAllTasks(aggregatedTasks);
      } catch (err) {
        toast.error("Failed to load workspace tasks");
      } finally {
        setLoading(false);
      }
    };
    
    // Only run if we actually have an ID to work with
    if (id) {
        fetchAllTasks();
    }
  }, [id, projects.length]); 

  const getStatusColor = (status) => {
    switch (status) {
      case "Todo": return "bg-gray-100 text-gray-800";
      case "InProgress": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "Blocked": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const sortedTasks = [...allTasks].sort((a, b) => {
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
      return new Date(b.created_at) - new Date(a.created_at); 
    }
  });

  const handleDeleteTask = async (taskId, e) => {
    e.stopPropagation();
    try {
      await deleteTask(taskId);
      setAllTasks(allTasks.filter(t => t.task_id !== taskId));
      toast.success("Task deleted!");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  return (
    <WorkspaceLayout id={id}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary font-poppins mb-2">Workspace Tasks</h1>
            <p className="text-gray-600">All tasks across your projects in this workspace.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
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
        </div>

        {loading ? (
          <div className="flex justify-center p-12 text-primary font-medium text-lg">Loading tasks...</div>
        ) : allTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-gray-400 mb-4 text-6xl">📋</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No tasks found</h3>
            <p className="text-gray-500">There are no tasks in any of your projects yet.</p>
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

                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2" title={task.title}>
                  {task.title}
                </h3>
                <span className="text-xs text-primary font-medium bg-blue-50 px-2 py-0.5 rounded inline-block mb-3">
                    Project: {task.projectName}
                </span>

                <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-50">
                  <span className="text-xs font-medium text-gray-500">
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

      {isTaskModalOpen && selectedTask && (
        <TaskModal 
          task={selectedTask} 
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }} 
          onUpdate={(updatedData) => {
            updateTask(selectedTask.task_id, updatedData);
            setAllTasks(allTasks.map(t => 
              t.task_id === selectedTask.task_id ? { ...t, ...updatedData } : t
            ));
            setSelectedTask({ ...selectedTask, ...updatedData });
          }}
        />
      )}
    </WorkspaceLayout>
  );
};

export default WorkspaceTasks;
