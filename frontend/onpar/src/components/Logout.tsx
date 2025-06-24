import { useNavigate } from "react-router";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");     // Remove the saved JWT
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="p-4 text-2xl rounded-lg border-4 border-onparOrange bg-onparLightYellow hover:bg-onparOrange text-black font-bold transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
