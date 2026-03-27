import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { apiFetch } from "../components/api/apiFetch";
import { toast } from "react-toastify";

const InviteAccept = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const acceptInvite = async () => {
      try {
        await apiFetch(`api/invite/${token}/accept/`, {
          method: "POST",
        });

        toast.success("Joined workspace successfully!");
        navigate("/workspace");
      } catch (err) {
        if (
          err.message.toLowerCase().includes("authentication") ||
          err.message.toLowerCase().includes("credentials")
        ) {
          toast.info("Please register or login to accept this invitation");

          navigate(`/login?redirect=/invite/${token}`);
        } else {
          toast.error(err.message);
          navigate("/");
        }
      }
    };

    acceptInvite();
  }, [token]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Processing invitation...</p>
    </div>
  );
};

export default InviteAccept;
