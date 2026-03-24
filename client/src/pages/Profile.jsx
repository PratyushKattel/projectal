import { useContext } from "react";
import { AuthContext } from "../components/context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome {user?.email}</h1>
    </div>
  );
};

export default Profile;