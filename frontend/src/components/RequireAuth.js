import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () =>{
    const {auth} = useAuth();
    const location =useLocation();

    return(
        <>
        {/*if auth done, display outlet that child component need auth; else go to login path*/}
        {auth}?.user ? <Outlet/>:<Navigate to="/" state={{ from: location}} replace/>
        </>
    );
};

export default RequireAuth;
