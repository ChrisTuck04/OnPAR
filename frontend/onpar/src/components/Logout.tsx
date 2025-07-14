import { useNavigate } from "react-router";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");     // Remove the saved JWT
    navigate("/");
  };

  return (
    <button onClick={handleLogout} className="w-[193px] h-[52px] hover:bg-onparOrange border-[3px] border-onparOrange bg-onparLightYellow rounded-2xl p-5 text-l">
      <span className="relative bottom-[6px]">Logout</span>
    </button>
  );
};

export default LogoutButton;
