import React, { useState, useEffect } from "react";
import useFetch from "../../../hooks/useFetch";
import { getToday } from "./event_functions";

const TodaySchedule = () => {
  const [courses, setCourses] = useState(null);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [schedules, setSchedules] = useState(null);

  const { data, error, loading } = useFetch(
    import.meta.env.VITE_GET_EVENTS,
    {}
  );

  useEffect(() => {
    document.title = "Class Link | Today";
    if (data) {
      setSchedules(data.events);
      setCourses(data.courses);
    }
  }, [data]);

  const day = new Date();
  const today = getToday(day.getDay());
  const todayDate = day.getDate();
  const todayMonth = day.getMonth() + 1;
  const todayYear = day.getFullYear();

  const todayFullDate = `${todayYear}-${todayMonth}-${todayDate}`;

  const fullEvents = [];
  schedules &&
    schedules.map((sc) =>
      sc.day
        ? sc.day === today && fullEvents.push(sc)
        : sc.date
        ? sc.date.split("T")[0] === todayFullDate && fullEvents.push(sc)
        : ""
    );

  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    const hour24 = period === "PM" && hours !== 12 ? hours + 12 : hours;
    return new Date(2000, 0, 1, hour24, minutes);
  };
  const sortedEvents = [...fullEvents].sort((a, b) => {
    const timeA = parseTime(a.start_time.split("T")[0]);
    const timeB = parseTime(b.start_time.split("T")[0]);
    return timeA - timeB;
  });

  const handleViewAllEvents = () => {
    setShowAllEvents(!showAllEvents);
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "class":
        return <span className="bi bi-book text-info me-2"></span>;
      case "exams":
        return <span className="bi bi-journal-check text-success me-2"></span>;
      case "forum":
        return <span className="bi bi-chat-dots text-warning me-2"></span>;
      default:
        return <span className="bi bi-calendar text-secondary me-2"></span>;
    }
  };

  return (
    <>
      <div className="row g-2">
        <div className="col-lg-12">
          <h2>Today's Schedule - {today}</h2>
          {loading && <p>Loading Events ...</p>}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error.message}
            </div>
          )}
          {!loading && !error && schedules && sortedEvents.length > 0 ? (
            <>
              <table className="table table-primary">
                <thead>
                  <tr>
                    <th scope="col">
                      <div className="ms-1">Event</div>
                    </th>
                    <th>Type</th>
                    <th>Start Time</th>
                    <th>Duration</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEvents
                    .slice(0, showAllEvents ? sortedEvents.length : 5)
                    .map((event, idx) => (
                      <tr key={idx}>
                        <td>
                          {getEventIcon(
                            event.day
                              ? "class"
                              : event.title
                              ? "forum"
                              : "exams"
                          )}
                          {event.title
                            ? event.title
                            : courses.map(
                                (c) =>
                                  c.unit_code == event.unit_code &&
                                  c.course_title
                              )}
                        </td>
                        <td>
                          {event.day
                            ? "Class"
                            : event.title
                            ? "Forum"
                            : "Examination"}
                        </td>
                        <td>{event.start_time}</td>
                        <td>{event.duration} hours</td>
                        <td>{event.location ? event.location : event.room}</td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {schedules && schedules.length > 5 && (
                <button
                  className="btn btn-outline-primary view-btn w-100"
                  onClick={handleViewAllEvents}
                >
                  {showAllEvents ? "Show Less" : "View All Events"}
                </button>
              )}
            </>
          ) : (
            !loading && <p>No Events Available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default TodaySchedule;
