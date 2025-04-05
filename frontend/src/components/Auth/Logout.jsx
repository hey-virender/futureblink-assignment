import React from "react";
import useAxios from "../../hooks/useAxios";

const Logout = () => {
  const axios = useAxios()
  const handleLogout = async() => {
    const response = await axios.get("/auth/logout");
    if (response.status === 200) {
      localStorage.removeItem("schedulerUserName");
      console.log("Logout successful:", response.data);
    } else {
      console.error("Logout failed:", response.data);
    }
    
   
    window.location.href = "/";
  };
  return (
    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
