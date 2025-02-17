document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("auth-form");
  const title = document.getElementById("form-title");
  const toggleText = document.getElementById("toggle-form");

  let isLogin = true;

  const updateForm = () => {
      title.textContent = isLogin ? "Login" : "Sign Up";
      toggleText.innerHTML = isLogin
          ? "Don't have an account? <span id='toggle-link'>Sign Up</span>"
          : "Already have an account? <span id='toggle-link'>Login</span>";

      // Reattach event listener after updating innerHTML
      document.getElementById("toggle-link").addEventListener("click", toggleForm);
  };

  const toggleForm = () => {
      isLogin = !isLogin;
      updateForm();
  };

  document.getElementById("toggle-link").addEventListener("click", toggleForm);

  form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const endpoint = isLogin ? "http://localhost:5000/api/login" : "http://localhost:5000/api/signup";

      const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      alert(data.message);

      // ✅ Redirect to game page after successful login
      if (isLogin && response.ok) {
        localStorage.setItem("authToken", data.token); // Store token
        window.location.href = "../Game/index.html";  // Redirect to game
    }
    
    window.addEventListener("beforeunload", () => {
      localStorage.removeItem("authToken");
    });

    document.addEventListener("DOMContentLoaded", () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
          alert("Session expired! Please log in again.");
          window.location.href = "../index.html"; // Redirect to login page
      }
    });
  });
});
