import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { UserContext } from "../../contexts/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [submitData, setSubmitData] = useState(false); // Used for controlling fetch
  const [login, setLogin] = useState({
    name: "",
    password: "",
  });

  // Controlled fetch with shouldFetch flag
  const { data, error, loading } = useFetch(
    submitData ? import.meta.env.VITE_LOGIN : null,
    {
      method: "POST",
      body: JSON.stringify(login),
      headers: { "Content-Type": "application/json" },
    },
    submitData // Only fetch when submitData is true
  );

  const handleSignIn = (e) => {
    e.preventDefault();
    setSubmitData(true); // Trigger fetch on form submit
  };

  const handleInputChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    document.title = "Class Link | Login";

    // Reset submitData after response
    if (data || error) {
      setSubmitData(false); // Prevent refetching on input change
    }

    if (data && data.user) {
      setUser(data.user);
      navigate("/dashboard");
    }
  }, [data, error]);

  return (
    <div className="min-vh-100 main flex-c">
      <h2>
        Class<span className="designed">Link.</span>
      </h2>
      <p>Please Login</p>
      {loading && <small>Login process may delay please wait.</small>}
      {error && (
        <div className="text-danger">
          <p>{error}</p>
        </div>
      )}

      {!error && !loading && data && (
        <div>
          <p className="text-danger">{data && data.message}</p>
        </div>
      )}

      <form onSubmit={handleSignIn} className="w-25">
        <div className="form-group">
          <label>Name [Platform Admin]</label>
          <input
            type="text"
            name="name"
            value={login.name}
            onChange={handleInputChange}
            placeholder="Enter Your name"
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Password [admin]</label>
          <input
            type="password"
            name="password"
            value={login.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="remember"
              id="rememberMe"
            />
            <label className="form-check-label w-100" htmlFor="rememberMe">
              <div className="flex-r">
                <small>Remember Me</small>
                <small>Forgot password</small>
              </div>
            </label>
          </div>
        </div>
        <button type="submit" className="btn w-100 view-btn">
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
