import { useParams } from "react-router-dom";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";

const WorkspaceCalendar = () => {
  const { id } = useParams();

  return (
    <WorkspaceLayout id={id}>
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <h1 className="text-3xl font-bold text-primary font-poppins mb-2">Calendar</h1>
        <p className="text-gray-600 mb-8">View your upcoming deadlines and project milestones.</p>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex-grow flex flex-col justify-center items-center">
            <div className="text-gray-300 mb-6 text-8xl transition-transform hover:scale-110 duration-300">📅</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3 font-poppins">Calendar View Dashboard</h3>
            <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed">
              Our team is actively building a full-featured calendar to help you track all task due dates and project timelines in one place. Stay tuned!
            </p>
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspaceCalendar;
