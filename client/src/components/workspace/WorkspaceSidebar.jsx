const WorkspaceSidebar = ({ onInviteClick }) => {
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

      <nav className="flex flex-col space-y-1 flex-1">
        <a
          href="#"
          className="px-4 py-3 text-gray-700 hover:bg-background hover:text-primary rounded-lg transition-all duration-200 font-medium"
        >
          Projects
        </a>
        <a
          href="#"
          className="px-4 py-3 text-gray-700 hover:bg-background hover:text-primary rounded-lg transition-all duration-200 font-medium"
        >
          Tasks
        </a>
        <a
          href="#"
          className="px-4 py-3 text-gray-700 hover:bg-background hover:text-primary rounded-lg transition-all duration-200 font-medium"
        >
          Calendar
        </a>
        <a
          href="#"
          className="px-4 py-3 text-gray-700 hover:bg-background hover:text-primary rounded-lg transition-all duration-200 font-medium"
        >
          Settings
        </a>
      </nav>
    </div>
  );
};

export default WorkspaceSidebar;
