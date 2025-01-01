import React, { useState, useEffect, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import { UserContext } from "../../contexts/UserContext";

const Meetings = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.role;
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [meetings, setMeetings] = useState(null);
  const [addingMeeting, setAddingMeeting] = useState(null);
  const [addMeeting, setAddMeeting] = useState({
    title: "",
    date: "",
    start_time: "",
    duration: "",
    location: "",
    description: "",
  });
  const [fetchUrl, setFetchUrl] = useState({
    url: import.meta.env.VITE_GET_MEETINGS,
    options: {},
  });

  const { data, error, loading } = useFetch(fetchUrl.url, fetchUrl.options);

  useEffect(() => {
    document.title = "Class Link | Meetings";
    if (data) {
      setMeetings(data.meetings);
    }
  }, [data]);

  const openModal = (item, action) => {
    action === "add-Meeting"
      ? setAddingMeeting(item)
      : setSelectedMeeting(item);
    setEditingMeeting(null);
  };

  const closeModal = () => {
    setSelectedMeeting(null);
    setEditingMeeting(null);
    setAddingMeeting(null);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddingMeeting((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMeeting = (e) => {
    e.preventDefault();
    setFetchUrl({
      url: `${import.meta.env.VITE_ADD_MEETING}`,
      options: {
        method: "POST",
        body: addingMeeting,
        headers: { "Content-Type": "application/json" },
      },
    });

    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingMeeting((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    setFetchUrl({
      url: `${import.meta.env.VITE_UPDATE_MEETING}/${editingMeeting.id}`,
      options: {
        method: "PATCH",
        body: editingMeeting,
        headers: { "Content-Type": "application/json" },
      },
    });

    closeModal();
  };

  const handleDelete = () => {
    setFetchUrl({
      url: `${import.meta.env.VITE_DELETE_MEETING}/${selectedMeeting.id}`,
      options: {
        method: "DELETE",
      },
    });

    closeModal();
  };

  return (
    <div className="container mt-4">
      <div className="flex-r mb-3">
        <h2 className="">Meetings Timetable</h2>
        {userRole !== "student" && (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => openModal(addMeeting, "add-Meeting")}
          >
            Create More
          </button>
        )}
      </div>
      {loading && <p>Loading Meetings Timetable ...</p>}
      {error && (
        <div className="alert alert-danger " role="alert">
          {error.message}
        </div>
      )}
      {!loading && !error && meetings && meetings.length > 0 ? (
        <table className="table table-primary">
          <thead>
            <tr>
              <th scope="col">
                <div className="text-start ms-1">Title</div>
              </th>
              <th scope="col">Date</th>
              <th scope="col">Start Time</th>
              <th scope="col">Duration</th>
              <th scope="col">Location</th>
              {userRole === "admin" && (
                <th scope="col">
                  <div className="text-end me-2"> Action</div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {meetings &&
              meetings.map((meeting) => (
                <tr key={meeting.id}>
                  <td>{meeting.title}</td>
                  <td>{meeting.date.split("T")[0]}</td>
                  <td>{meeting.start_time}</td>
                  <td>{meeting.duration} hours</td>
                  <td>{meeting.location}</td>
                  {userRole === "admin" && (
                    <td className="text-end">
                      <a
                        className="btn btn-sm btn-outline-primary view-btn"
                        onClick={() => openModal(meeting, "view")}
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
        !loading && <p>No Timetable Available</p>
      )}

      {(selectedMeeting || addingMeeting) && (
        <div
          className="modal fade show custom-modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content animate-modal">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {addingMeeting ? "Add Meeting" : `Meeting Details`}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                />
              </div>
              <div className="modal-body">
                {selectedMeeting && !addingMeeting && (
                  <div className="assignment-details-card">
                    <div className="assignment-info-modal mt-3">
                      <h5>{selectedMeeting.title}</h5>
                      <p>
                        <strong>Date:</strong>{" "}
                        {selectedMeeting.date.split("T")[0]}
                      </p>
                      <p>
                        <strong>Time:</strong> {selectedMeeting.start_time}
                      </p>
                      <p>
                        <strong>Duration:</strong> {selectedMeeting.duration}{" "}
                        hour
                      </p>
                      <p>
                        <strong>Location:</strong> {selectedMeeting.location}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedMeeting.description}
                      </p>
                      <hr />
                    </div>
                  </div>
                )}

                {editingMeeting && !addingMeeting && (
                  <form onSubmit={handleUpdate} id="editForm">
                    <p>Update Meetings</p>
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        name="title"
                        value={editingMeeting.title}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={editingMeeting.date.split("T")[0]}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="time"
                        name="start_time"
                        value={editingMeeting.start_time}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Duration</label>
                      <input
                        type="number"
                        name="duration"
                        min={1}
                        value={editingMeeting.duration}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={editingMeeting.location}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={editingMeeting.description}
                        onChange={handleInputChange}
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
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {!editingMeeting && !addingMeeting && (
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
                          onClick={() => setEditingMeeting(selectedMeeting)}
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
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {addingMeeting && (
                  <form onSubmit={handleAddMeeting}>
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        name="title"
                        value={addingMeeting.title}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={addingMeeting.date}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="time"
                        name="start_time"
                        value={addingMeeting.start_time}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Duration</label>
                      <input
                        type="number"
                        name="duration"
                        value={addingMeeting.duration}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={addingMeeting.location}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={addingMeeting.description}
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
                            Add Meeting
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
      {(selectedMeeting || addingMeeting) && (
        <div className="modal-backdrop fade show" onClick={closeModal}></div>
      )}
    </div>
  );
};

export default Meetings;
