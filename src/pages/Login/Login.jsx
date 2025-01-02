import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [login, setLogin] = useState({
    name: "",
    password: "",
  });

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(import.meta.env.VITE_LOGIN, {
        method: "POST",
        body: JSON.stringify(login),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to login");
      }

      setData(result);
      if (result.user) {
        setUser(result.user);
        navigate("/classLink/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    document.title = "Class Link | Login";
  }, []);

  return (
    <div className="min-vh-100 main flex-c">
      <h2>
        Class<span className="designed">Link.</span>
      </h2>
      {!loading && <p>Password and name provided in the resume</p>}

      {loading && <p>Please wait, Render may take some time</p>}
      {error && (
        <div className="text-danger">
          <p>{error}</p>
        </div>
      )}

      {!error && !loading && data && (
        <div>
          <p className="text-danger">{data.message}</p>
        </div>
      )}

      <form onSubmit={handleSignIn} className="w-25">
        <div className="form-group">
          <label>Name</label>
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
          <label>Password</label>
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
