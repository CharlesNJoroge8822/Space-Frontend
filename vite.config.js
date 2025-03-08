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
        body: JSON.stringify({ email, password, role }), // Include role in the request body
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Invalid login credentials.");
        return;
      }
  
      const data = await response.json();
  
      // Assuming these functions are defined elsewhere
      setAuthToken(data.access_token);
      setCurrentUser(data);
  
      // Save token and user data to localStorage
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data));
  
      toast.success("Login successful!");
      navigate(data.role === "admin" ? "/admin" : "/student");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to connect to the server.");
    }
  };