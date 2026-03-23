import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const WorkspaceNav = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>loading ....</div>;
  }

  return <div>{user}</div>;
};

export default WorkspaceNav;
