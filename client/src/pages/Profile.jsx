import { useContext } from "react";
import { AuthContext } from "../components/context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const getInitials = (email) => {
    if (!email || email === "authenticated") return "U";
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="group bg-white border border-gray-200 rounded-2xl p-10 w-72 flex flex-col items-center gap-4 transition-all duration-200 hover:-translate-y-1 hover:border-primary cursor-default"
        style={{ width: "288px" }}>

        {/* Avatar */}
        <div
          className="rounded-full border-2 border-primary bg-background flex items-center justify-center transition-all duration-200 group-hover:bg-primary"
          style={{ width: "88px", height: "88px" }}>
          <span className="text-3xl font-medium text-primary group-hover:text-white transition-colors duration-200">
            {getInitials(user?.email)}
          </span>
        </div>

        {/* Name / Email */}
        <div className="flex flex-col items-center gap-1 font-inter">
          <p className="text-lg font-medium text-gray-900">{user?.name ?? "User"}</p>
          <p className="text-sm text-gray-500">{user?.email ?? "—"}</p>
        </div>

        {/* Role badge */}
        <span className="bg-background text-primary text-xs font-medium px-4 py-1 rounded-lg transition-all duration-200 group-hover:bg-primary group-hover:text-white font-poppins">
          {user?.role ?? "Member"}
        </span>

        <div className="w-full h-px bg-gray-100" />

        {/* Meta rows */}
        <div className="w-full flex flex-col gap-2 text-sm font-inter">
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-800">{user?.email ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Role</span>
            <span className="font-medium text-gray-800">{user?.role ?? "Member"}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;