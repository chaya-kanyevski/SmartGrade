import { UserContext } from "@/context/UserReducer";
import { useContext, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user.id) {
        navigate("/login", { replace: true });
      }
  }, [navigate]);

  return <Outlet />; 
};

export default PrivateRoute;
