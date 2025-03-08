import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})



const login = async (email, password, role, navigate) => {
  try {
      if (!role) {
          toast.error("Role is required for login.");
          return;
      }

      const loginEndpoint = "https://backend-student-motivation-app-1.onrender.com/login";
      const response = await fetch(loginEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
          setAuthToken(data.access_token);
          setCurrentUser(data);
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("user", JSON.stringify(data));

          toast.success("Login successful!");
          navigate(data.role === "admin" ? "/admin" : "/student");
      } else {
          toast.error(data.error || "Invalid login credentials.");
      }
  } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to connect to the server.");
  }
};