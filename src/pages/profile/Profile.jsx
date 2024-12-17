import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import useFetch from "../../hooks/useFetch";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [image, setImage] = useState(user?.image || "");
  const [newImage, setNewImage] = useState({
    image: "",
  });
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("warning");

  const [fetchUrl, setFetchUrl] = useState({
    url: null,
    options: {},
  });

  const { data, error, loading } = useFetch(fetchUrl.url, fetchUrl.options);

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    type === "password"
      ? setPassword((prev) => ({ ...prev, [name]: value }))
      : setNewImage((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = () => {
    if (!password.currentPassword) {
      setAlertMessage("Please enter your current password");
      setAlertType("warning");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 3000);
      return;
    }
    if (password.newPassword.length < 5) {
      setAlertMessage("New password must be at least 5 characters long");
      setAlertType("warning");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 3000);
      return;
    }
    if (password.newPassword !== password.confirmPassword) {
      setAlertMessage("New passwords do not match");
      setAlertType("warning");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 3000);
      return;
    }

    const userUpdate = {
      password: password.currentPassword,
      changedPassword: password.newPassword,
      name: user?.name,
      role: user?.role,
    };

    setFetchUrl({
      url: `${import.meta.env.VITE_CHANGE_PASSWORD}/${user?.id}`,
      options: {
        method: "PATCH",
        body: userUpdate,
        headers: { "Content-Type": "application/json" },
      },
    });
  };

  const handleImageChange = () => {
    const userUpdate = {
      image: newImage.image,
      role: user?.role,
    };

    setFetchUrl({
      url: `${import.meta.env.VITE_CHANGE_IMAGE}/${user?.id}`,
      options: {
        method: "PATCH",
        body: userUpdate,
        headers: { "Content-Type": "application/json" },
      },
    });
  };

  const handleAlertMessage = (item) => {
    if (item === data) {
      setAlertMessage(data.message);
      setAlertType("success");

      if (data.update) {
        localStorage.setItem("classUser", JSON.stringify(data.update));
        setUser(data.update);
        setImage(data.update.image);
      }
    }
    if (item === error) {
      setAlertMessage(error.message);
      setAlertType("warning");
    }
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("warning");

      setPassword({
        currentPassword: "",
        confirmPassword: "",
        newPassword: "",
      });

      data.update &&
        setNewImage({
          image: "",
        });
    }, 3000);
  };

  useEffect(() => {
    document.title = "Class Link | Profile";

    if (data || error) {
      data && handleAlertMessage(data);
      error && handleAlertMessage(error);
    }
  }, [data, error]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Profile Page</h2>

      {/* Profile Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Profile Information</h5>
          <div className="row align-items-center">
            <div className="col-md-4">
              <img
                src={image}
                alt="Profile"
                className="img-fluid rounded-circle mb-3"
                width={200}
              />
            </div>
            <div className="col-md-8">
              <p>
                <strong>Name:</strong> {name}
              </p>
              <p>
                <strong>Email:</strong> {email}
              </p>
              <p>
                <strong>Phone:</strong> {phone || "Not Provided"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Profile Image */}
      <div className="card mb-4">
        <div className="card-body">
          {/* Info Banner */}
          <div className="alert alert-info" role="alert">
            Please use a recognizable image for your profile.
          </div>
          <h5 className="card-title">Change Profile Image</h5>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleImageChange();
            }}
          >
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Image URL
              </label>
              <input
                type="text"
                className="form-control"
                id="image"
                name="image"
                value={newImage.image}
                onChange={(e) => handleInputChange(e, "image")}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-25">
              Update Image
            </button>
          </form>
        </div>
      </div>
      {alertMessage && (
        <div className={`alert alert-${alertType}`}>{alertMessage}</div>
      )}
      {/* Change Password Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Change Password</h5>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordChange();
            }}
          >
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <input
                type="password"
                className="form-control"
                id="currentPassword"
                name="currentPassword"
                value={password.currentPassword}
                onChange={(e) => handleInputChange(e, "password")}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                name="newPassword"
                value={password.newPassword}
                onChange={(e) => handleInputChange(e, "password")}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={password.confirmPassword}
                onChange={(e) => handleInputChange(e, "password")}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-25">
              {loading ? "Please wait ..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
