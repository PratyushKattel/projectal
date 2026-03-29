import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useMessageStore } from "../../store/MessageStore";

const TaskModal = ({ task, onClose, onUpdate }) => {
  const { messages, loading, fetchMessages, addMessage, removeMessage } = useMessageStore();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // For modifying Task Details inside the Modal
  const [editingField, setEditingField] = useState(null);
  const [taskData, setTaskData] = useState(task);

  useEffect(() => {
    fetchMessages(task.task_id);
    setTaskData(task);
  }, [task]);

  // Scroll to bottom when messages load or change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await addMessage(task.task_id, newMessage);
      setNewMessage("");
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      await removeMessage(msgId);
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };

  const handleTaskUpdate = (field, value) => {
    const updated = { [field]: value };
    setTaskData({ ...taskData, ...updated });
    onUpdate({ ...taskData, ...updated });
    setEditingField(null);
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 sm:p-6 pb-20 sm:pb-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[85vh] flex overflow-hidden flex-col md:flex-row shadow-2xl">
        
        {/* Left column: Task Details (60%) */}
        <div className="md:w-3/5 bg-white border-b md:border-b-0 md:border-r border-gray-100 h-full flex flex-col relative overflow-y-auto w-full">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-4 w-full pr-4">
                <div className="flex justify-between items-center gap-3 mb-2">
                  <div className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(taskData.status)}`}>
                    {taskData.status}
                  </div>
                  <button 
                    onClick={onClose}
                    className="md:hidden text-gray-400 hover:text-gray-600 p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                
                {/* Title Editable */}
                {editingField === "title" ? (
                  <input
                    type="text"
                    value={taskData.title}
                    onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                    onBlur={(e) => handleTaskUpdate("title", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTaskUpdate("title", e.target.value)}
                    autoFocus
                    className="text-2xl font-bold w-full border-b-2 border-primary focus:outline-none py-1"
                  />
                ) : (
                  <h2 
                    className="text-2xl md:text-3xl font-bold text-gray-900 cursor-text hover:bg-gray-50 rounded-lg p-1 transition-colors border border-transparent hover:border-gray-200 -ml-1"
                    onClick={() => setEditingField("title")}
                  >
                    {taskData.title}
                  </h2>
                )}

                {/* Properties grid */}
                <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-gray-50 rounded-xl">
                  {/* Status Dropdown */}
                  <div>
                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</span>
                    <select
                      value={taskData.status}
                      onChange={(e) => handleTaskUpdate("status", e.target.value)}
                      className="text-sm border-0 bg-white font-medium text-gray-700 py-1.5 px-2 rounded w-full shadow-sm outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="Todo">Todo</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                  
                  {/* Priority Dropdown */}
                  <div>
                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Priority</span>
                    <select
                      value={taskData.priority}
                      onChange={(e) => handleTaskUpdate("priority", e.target.value)}
                      className="text-sm border-0 bg-white font-medium text-gray-700 py-1.5 px-2 rounded w-full shadow-sm outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  
                  <div className="col-span-2 mt-2">
                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Due Date</span>
                    <input
                      type="datetime-local"
                      value={taskData.due_date ? new Date(taskData.due_date).toISOString().slice(0, 16) : ""}
                      onChange={(e) => handleTaskUpdate("due_date", e.target.value)}
                      className="text-sm border-0 bg-white font-medium text-gray-700 py-1.5 px-2 rounded w-full sm:w-auto shadow-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Description Editable */}
                <div className="mt-8">
                  <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</span>
                  {editingField === "description" ? (
                    <div className="flex flex-col">
                      <textarea
                        value={taskData.description}
                        onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                        autoFocus
                        className="w-full text-base bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary py-3 px-4 min-h-[150px] resize-y shadow-sm"
                        placeholder="Add a more detailed description..."
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <button 
                          onClick={() => {
                            setTaskData({...taskData, description: task.description});
                            setEditingField(null);
                          }}
                          className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleTaskUpdate("description", taskData.description)}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-primary hover:bg-secondary rounded-md transition-colors shadow-sm"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="text-gray-700 whitespace-pre-wrap cursor-text hover:bg-gray-50 rounded-lg p-4 transition-colors min-h-[100px] border border-transparent hover:border-gray-200 text-base"
                      onClick={() => setEditingField("description")}
                    >
                      {taskData.description || <span className="text-gray-400 italic">Click to add description</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Messages/Activity (40%) */}
        <div className="md:w-2/5 flex flex-col bg-gray-50 w-full h-[50vh] md:h-full">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
              Activity & Comments
            </h3>
            <button 
              onClick={onClose}
              className="hidden md:flex text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
            {loading && messages.length === 0 ? (
              <p className="text-gray-500 text-center text-sm py-4">Loading messages...</p>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <p className="text-sm font-medium">No activity yet</p>
                <p className="text-xs">Be the first to leave a comment</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.message_id} className="group flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      M
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm relative">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <span className="font-semibold text-sm text-gray-900">User {msg.sender_id || ""}</span>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{msg.content}</p>
                      <button
                        onClick={() => handleDeleteMessage(msg.message_id)}
                        className="absolute -right-2 -top-2 bg-white rounded-full p-1 shadow border border-gray-100 text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                        title="Delete comment"
                      >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-200 z-10">
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask a question or post an update..."
                className="w-full border border-gray-200 rounded-full pl-5 pr-12 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-colors shadow-sm"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="absolute right-2 top-1 bottom-1 px-3 text-primary hover:text-secondary disabled:text-gray-300 disabled:opacity-50 transition-colors flex items-center justify-center rounded-r-full"
              >
                <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
