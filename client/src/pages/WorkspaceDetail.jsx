import { useParams } from "react-router-dom";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";

const WorkspaceDetail = () => {
  const { id } = useParams();

  return (
    <WorkspaceLayout id={id}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-primary font-poppins">
          Workspace {id}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Project 1
            </h3>
            <p className="text-gray-600">Description of project 1</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Project 2
            </h3>
            <p className="text-gray-600">Description of project 2</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Task 1</h3>
            <p className="text-gray-600">Description of task 1</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Task 2</h3>
            <p className="text-gray-600">Description of task 2</p>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspaceDetail;
