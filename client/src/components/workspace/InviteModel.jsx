import { useState } from "react";
import useWorkSpaceStore from "../../store/WorkspaceStore";
import { toast } from "react-toastify";

const InviteModal = ({ onClose, ws_id }) => {
  const [email, setEmail] = useState("");

  const invitePeople = useWorkSpaceStore((state) => state.invitePeople);

  const handleInvite = async () => {
    if (!email.trim()) {
      return;
    }
    await invitePeople(ws_id, email);
    console.log(`ws id is ${ws_id} and email is ${email}`);
    setEmail("");
    toast.success(`invitation sent to ${email} successfully`);
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Invite People</h3>
        <input
          type="email"
          placeholder="Enter email"
          className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Invite
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
