import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(() => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
    return null;
  }
});


  const login = async (inputs) => {
   
    const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
      withCredentials: true,
    });
    setCurrentUser(res.data)
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
