import { useEffect } from "react";
import { useParams } from "react-router-dom";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import useActivityStore from "../store/ActivityStore";

const WorkspaceActivity = () => {
  const { id } = useParams();
  const { activities, fetchActivities, loading } = useActivityStore();

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <WorkspaceLayout id={id}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary font-poppins">
            Activity
          </h1>
          <p className="text-gray-500 mt-1">
            Stay updated with recent task activity and messages
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center p-12 text-primary font-medium text-lg">
            Loading activity...
          </div>
        )}

        {/* Empty */}
        {!loading && activities.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-gray-400 mb-4 text-6xl">🔔</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No activity yet
            </h3>
            <p className="text-gray-500">
              Updates from tasks and messages will appear here.
            </p>
          </div>
        )}

        {/* Activity Cards */}
        <div className="space-y-5">
          {activities.map((task) => (
            <div
              key={task.task_id}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Task Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="font-semibold text-lg text-gray-900">
                    {task.title}
                  </h2>
                  <div className="text-xs text-gray-500 mt-1">
                    {task.status} • {task.priority}
                  </div>
                </div>

                {/* Badge */}
                {task.messages.length > 0 && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                    {task.messages.length} updates
                  </span>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-3"></div>

              {/* Messages */}
              <div className="space-y-3">
                {task.messages.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    No recent messages
                  </p>
                ) : (
                  task.messages.map((msg) => (
                    <div
                      key={msg.message_id}
                      className="flex items-start gap-3"
                    >
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {msg.sender_name
                          ? msg.sender_name[0].toUpperCase()
                          : "U"}
                      </div>

                      {/* Message Content */}
                      <div className="flex-1">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-800">
                              {msg.sender_name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(msg.created_at).toLocaleString()}
                            </span>
                          </div>

                          <p className="text-sm text-gray-700">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspaceActivity;
