import React, { useContext, useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { Link } from "react-router-dom";
import { days, weekdaysOrder } from "./days";
import { UserContext } from "../../../contexts/UserContext";
const Timetable = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.role;
  const [timetables, setTimeTable] = useState(null);
  const [groupedTimetable, setGroupedTimetable] = useState({});
  const [courses, setCourses] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [addingSchedule, setAddingSchedule] = useState(null);
  const [addSchedule, setAddSchedule] = useState({
    unit_code: "",
    day: "",
    start_time: "",
    duration: "",
    room: "",
  });
  const [fetchUrl, setFetchUrl] = useState({
    url: import.meta.env.VITE_GET_TIMETABLE,
    options: {},
  });

  const { data, error, loading } = useFetch(fetchUrl.url, fetchUrl.options);

  useEffect(() => {
    document.title = "Class Link | Timetable";
    if (data) {
      setTimeTable(data.schedules);
      setCourses(data.courses);
      groupByDay(data.schedules);
    }
  }, [data]);

  const openModal = (item, action) => {
    action === "add-subject"
      ? setAddingSchedule(item)
      : setSelectedSubject(item);
    setEditingSubject(null);
  };

  const closeModal = () => {
    setSelectedSubject(null);
    setEditingSubject(null);
    setAddingSchedule(null);
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    setFetchUrl({
      url: `${import.meta.env.VITE_ADD_TIMETABLE}`,
      options: {
        method: "POST",
        body: addingSchedule,
        headers: { "Content-Type": "application/json" },
      },
    });
    closeModal();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setFetchUrl({
      url: `${import.meta.env.VITE_UPDATE_TIMETABLE}/${editingSubject.id}`,
      options: {
        method: "PATCH",
        body: editingSubject,
        headers: { "Content-Type": "application/json" },
      },
    });
    closeModal();
  };

  const handleDelete = () => {
    setFetchUrl({
      url: `${import.meta.env.VITE_DELETE_TIMETABLE}/${selectedSubject.id}`,
      options: {
        method: "DELETE",
      },
    });
    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingSubject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddingSchedule((prev) => ({ ...prev, [name]: value }));
  };

  // Group subjects by day of the week
  const groupByDay = (timetables) => {
    const grouped = {};
    timetables.forEach((tt) => {
      const { day } = tt;
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push({ ...tt, unit_code: tt.unit_code });
    });

    setGroupedTimetable(grouped);
  };

  // Weekdays in the correct order

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <div className="flex-r my-4">
          <h2>Semester Timetable</h2>
          {userRole === "admin" && courses && courses.length > 0 && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => openModal(addSchedule, "add-subject")}
            >
              Create More
            </button>
          )}
        </div>
        {loading && <p>Loading Timetable ...</p>}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error.message}
          </div>
        )}
        {!loading && !error && timetables && timetables.length > 0 ? (
          weekdaysOrder
            .filter((day) => groupedTimetable[day]) // Only display days that have schedules
            .map((day) => (
              <div key={day} className="mb-4">
                <div className="flex-r my-3">
                  <h4 className="text-primary">{day}</h4>
                </div>
                <table className="table table-primary">
                  <thead>
                    <tr>
                      <th scope="col">
                        <div className="ms-1">Subject</div>
                      </th>
                      <th>Start Time</th>
                      <th>Duration</th>
                      <th>Location</th>
                      {userRole === "admin" && (
                        <th scope="col">
                          <div className="text-end me-2"> Action</div>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {groupedTimetable[day].map((schedule, idx) => (
                      <tr key={idx}>
                        <td>
                          {courses.map((c) => (
                            <div key={c.id}>
                              {c.unit_code == schedule.unit_code &&
                                c.course_title}
                            </div>
                          ))}
                        </td>
                        <td>{schedule.start_time}</td>
                        <td>{schedule.duration} hours</td>
                        <td>{schedule.room}</td>
                        {userRole === "admin" && (
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-primary view-btn"
                              onClick={() => openModal(schedule, "views")}
                            >
                              View Details
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
        ) : (
          <>
            {!loading && <p>No Timetable available</p>}
            {!error && !loading && courses && courses.length === 0 && (
              <>
                <p>
                  <i className="bi bi-patch-question"></i> Create Courses in
                  order to add Timetable
                </p>
                <Link to={"/classLink/courses"} className="btn btn-sm view-btn">
                  Create Courses
                </Link>
              </>
            )}
          </>
        )}
      </div>

      {(selectedSubject || addingSchedule) && (
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
                  {addingSchedule ? "Add Schedule" : `Schedule Details`}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                />
              </div>
              <div className="modal-body">
                {selectedSubject && !addingSchedule && (
                  <div className="teacher-details-card">
                    <div className="teacher-info-modal mt-3">
                      <h3>
                        {courses.map((c) => (
                          <div key={c.id}>
                            {c.unit_code == selectedSubject.unit_code &&
                              c.course_title}{" "}
                          </div>
                        ))}
                      </h3>
                      <p>
                        <strong>Start Time:</strong>{" "}
                        {selectedSubject.start_time}
                      </p>
                      <p>
                        <strong>Duration:</strong> {selectedSubject.duration}{" "}
                        hours
                      </p>
                      <p>
                        <strong>Location:</strong> {selectedSubject.room}
                      </p>
                      <hr />
                    </div>
                  </div>
                )}
                {editingSubject && !addingSchedule && (
                  <form onSubmit={handleUpdate}>
                    <h6>Update</h6>
                    <div className="form-group">
                      <label>Day</label>
                      <select
                        name="day"
                        id="day"
                        className="form-control mt-2"
                        value={editingSubject.day}
                        onChange={handleInputChange}
                      >
                        <option value="0">Select Day</option>
                        {days.map((day) => (
                          <option key={day.id} value={day.day}>
                            {day.day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Start Time</label>
                      <input
                        type="time"
                        name="start_time"
                        value={editingSubject.start_time}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Duration</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]+"
                        name="duration"
                        value={editingSubject.duration}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="room"
                        value={editingSubject.room}
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
                {!editingSubject && !addingSchedule && (
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
                          onClick={() => setEditingSubject(selectedSubject)}
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
                {addingSchedule && (
                  <form onSubmit={handleAddSchedule}>
                    <div className="form-group">
                      <label>Subject</label>
                      <select
                        name="unit_code"
                        id="unit_code"
                        className="form-control mt-2"
                        value={addingSchedule.unit_code}
                        onChange={handleAddChange}
                      >
                        <option value="0">Select Subject</option>
                        {courses &&
                          courses.map((course) => (
                            <option key={course.id} value={course.unit_code}>
                              {course.course_title}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Day</label>
                      <select
                        name="day"
                        id="day"
                        className="form-control mt-2"
                        value={addingSchedule.day}
                        onChange={handleAddChange}
                      >
                        <option value="0">Select Day</option>
                        {days.map((day) => (
                          <option key={day.id} value={day.day}>
                            {day.day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Start Time</label>
                      <input
                        type="time"
                        name="start_time"
                        value={addingSchedule.start_time}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Duration</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]+"
                        name="duration"
                        value={addingSchedule.duration}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="room"
                        value={addingSchedule.room}
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
                            Add Subject
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

      {(selectedSubject || addingSchedule) && (
        <div className="modal-backdrop fade show" onClick={closeModal}></div>
      )}
    </div>
  );
};

export default Timetable;
