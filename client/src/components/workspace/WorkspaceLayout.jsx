import { useState } from "react";
import WorkspaceSidebar from "./WorkspaceSidebar";
import InviteModal from "./InviteModel";

const WorkspaceLayout = ({ children, id }) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const handleOpenInvite = () => setIsInviteOpen(true);
  const handleCloseInvite = () => setIsInviteOpen(false);

  return (
    <div className="flex h-screen bg-background">
      <WorkspaceSidebar onInviteClick={handleOpenInvite} />

      <div className="flex-1 p-8 overflow-auto bg-surface">{children}</div>

      {isInviteOpen && <InviteModal onClose={handleCloseInvite} ws_id={id} />}
    </div>
  );
};

export default WorkspaceLayout;
