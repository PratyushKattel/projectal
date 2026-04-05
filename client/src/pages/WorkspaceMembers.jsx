import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useWorkSpaceStore from "../store/WorkspaceStore";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import { toast } from "react-toastify";

const WorkspaceMembers = () => {
  const { id } = useParams();
  const { members, currentWorkspace, getWorkspaceMembers, updateMemberRole, loading } = useWorkSpaceStore();

  useEffect(() => {
    getWorkspaceMembers(id);
  }, [id, getWorkspaceMembers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateMemberRole(id, userId, newRole);
      toast.success("Role updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update role");
    }
  };

  const isOwner = currentWorkspace?.role === "Owner";

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'owner': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'admin': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <WorkspaceLayout id={id}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-poppins">Workspace Members</h1>
            <p className="text-gray-500 mt-1">Manage who has access to this workspace and their permissions.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {(member.username || member.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{member.username}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {isOwner && member.role !== 'Owner' ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    ) : (
                      <span className="text-sm text-gray-400 italic">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {loading && members.length === 0 && (
             <div className="p-12 text-center text-gray-500">Loading members...</div>
          )}
          
          {!loading && members.length === 0 && (
             <div className="p-12 text-center text-gray-500">No members found.</div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspaceMembers;
