import React, { useContext, useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { UserContext } from "../../contexts/UserContext";

const Teachers = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.role;
  const [teachers, setTeachers] = useState(null);
  const [courses, setCourses] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [addingTeacher, setAddingTeacher] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [addTeacher, setAddTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    password: "",
    role: "",
  });
  const [fetchUrl, setFetchUrl] = useState({
    url: import.meta.env.VITE_GET_TEACHERS,
    options: {},
  });

  const { data, error, loading } = useFetch(fetchUrl.url, fetchUrl.options);

  useEffect(() => {
    document.title = "Class Link | Teachers";
    if (data) {
      setTeachers(data.teachers);
      setCourses(data.courses);
    }
  }, [data]);

  const openModal = (item, action) => {
    action === "add-teacher"
      ? setAddingTeacher(item)
      : setSelectedTeacher(item);
    setEditingTeacher(null);
  };

  const closeModal = () => {
    setSelectedTeacher(null);
    setEditingTeacher(null);
    setAddingTeacher(null);
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    setFetchUrl({
      url: `${import.meta.env.VITE_ADD_TEACHER}`,
      options: {
        method: "POST",
        body: addingTeacher,
        headers: { "Content-Type": "application/json" },
      },
    });
    window.location.reload();
    closeModal();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setFetchUrl({
      url: `${import.meta.env.VITE_UPDATE_TEACHER}/${editingTeacher.id}`,
      options: {
        method: "PATCH",
        body: editingTeacher,
        headers: { "Content-Type": "application/json" },
      },
    });
    window.location.reload();
    closeModal();
  };

  const handleDelete = () => {
    setFetchUrl({
      url: `${import.meta.env.VITE_DELETE_TEACHER}/${selectedTeacher.id}`,
      options: {
        method: "DELETE",
      },
    });
    window.location.reload();
    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddingTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  // Filter teachers based on search query
  const filteredTeachers = teachers
    ? teachers.filter((teacher) =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="container mt-4">
      <div className="flex-r mb-3">
        <h2>Teachers List</h2>
        <form className="search-form">
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search teachers.."
          />
          <button className="search-btn">Search</button>
        </form>
        {userRole === "admin" && (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => openModal(addTeacher, "add-teacher")}
          >
            Create More
          </button>
        )}
      </div>
      {loading && <p>Loading Teachers ...</p>}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error.message}
        </div>
      )}
      {!loading && !error && teachers && filteredTeachers.length > 0 ? (
        <table className="table table-primary">
          <thead>
            <tr>
              <th scope="col">
                <div className="text-start ms-1">Image</div>
              </th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Role</th>
              {userRole === "admin" && (
                <th scope="col">
                  <div className="text-end me-2"> Action</div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="text-start">
                  <img
                    src={teacher.image}
                    alt={`${teacher.name}'s photo`}
                    width="32"
                    height="32"
                    className="rounded-circle"
                  />
                </td>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.phone}</td>
                <td>{teacher.role}</td>
                {userRole === "admin" && (
                  <td className="text-end">
                    <a
                      className="btn btn-sm btn-outline-primary view-btn"
                      onClick={() => openModal(teacher, "edit-teacher")}
                    >
                      View Details
                    </a>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No Teacher Available</p>
      )}

      {(selectedTeacher || addingTeacher) && (
        <div
          className="modal fade show custom-modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content animate-modal">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title ">
                  {addingTeacher
                    ? "Add Teacher"
                    : `${selectedTeacher.name}'s Details`}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                />
              </div>
              <div className="modal-body">
                {selectedTeacher && !addingTeacher && (
                  <div className="teacher-details-card">
                    <img
                      src={selectedTeacher.image}
                      alt={`${selectedTeacher.name}'s photo`}
                      className="teacher-image-modal w-25 d-block"
                    />
                    <div className="teacher-info-modal mt-3">
                      <h4>{selectedTeacher.name}</h4>
                      <p>
                        <strong>Email:</strong> {selectedTeacher.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {selectedTeacher.phone}
                      </p>
                      <p>
                        <strong>Role:</strong> {selectedTeacher.role}
                      </p>
                      <p>
                        <strong>Subject:</strong>{" "}
                        {courses &&
                          courses
                            .filter((c) => c.teacher_id === selectedTeacher.id) // Filter courses for the selected teacher
                            .map((c) => c.course_title) // Get the course titles
                            .join(", ")}{" "}
                        {/* Join the titles with commas */}
                      </p>
                    </div>
                  </div>
                )}
                {editingTeacher && !addingTeacher && (
                  <form onSubmit={handleUpdate}>
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editingTeacher.name}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editingTeacher.email}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={editingTeacher.phone}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Role</label>
                      <select
                        name="role"
                        className="form-control mt-2"
                        value={editingTeacher.role}
                        onChange={handleInputChange}
                      >
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="modal-footer">
                      <div className="row g-2 w-100">
                        <div className="col-lg-6">
                          <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="col-lg-6">
                          <button
                            type="submit"
                            className="btn btn-info w-100 text-white"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
                {!editingTeacher && !addingTeacher && (
                  <div className="modal-footer">
                    <div className="row g-2 w-100">
                      <div className="col-lg-4">
                        <button
                          type="button"
                          className="btn btn-primary w-100"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="col-lg-4">
                        <button
                          type="button"
                          className="btn btn-info w-100 text-white"
                          onClick={() => setEditingTeacher(selectedTeacher)}
                        >
                          Update
                        </button>
                      </div>
                      <div className="col-lg-4">
                        <button
                          type="button"
                          className="btn btn-danger w-100"
                          onClick={handleDelete}
                        >
                          delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {addingTeacher && (
                  <form onSubmit={handleAddTeacher}>
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={addingTeacher.name}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={addingTeacher.email}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={addingTeacher.phone}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <select
                        name="role"
                        className="form-control mt-2"
                        value={addingTeacher.role}
                        onChange={handleAddChange}
                      >
                        <option value="0">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="teacher">Teacher</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="text"
                        name="password"
                        value={addingTeacher.password}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="text"
                        name="image"
                        value={addingTeacher.image}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>

                    <div className="modal-footer">
                      <div className="row g-2 w-100">
                        <div className="col-lg-6">
                          <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="col-lg-6">
                          <button
                            type="submit"
                            className="btn btn-info w-100 text-white"
                          >
                            Add Teacher
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {(selectedTeacher || addingTeacher) && (
        <div className="modal-backdrop fade show" onClick={closeModal}></div>
      )}
    </div>
  );
};

export default Teachers;
