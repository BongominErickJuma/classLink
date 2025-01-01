import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";

const AssignmentDetail = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.role;
  const { unitCode } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [course, setCourse] = useState(null);
  const [answered, setAnswered] = useState(null);
  const [addQuestion, setAddQuestion] = useState({ question: "" });
  const [editQuestions, setEditQuestions] = useState({});
  const [answerQuestions, setAnswerQuestions] = useState({});

  const [fetchUrl, setFetchUrl] = useState({
    url: `${import.meta.env.VITE_GET_COURSE_ASSIGNMENT}/${unitCode}`,
    options: {},
  });
  const { data, error, loading } = useFetch(fetchUrl.url, fetchUrl.options);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();

    setFetchUrl({
      url: `${import.meta.env.VITE_ADD_COURSE_ASSIGNMENT}/${unitCode}`,
      options: {
        method: "POST",
        body: addQuestion,
        headers: { "Content-Type": "application/json" },
      },
    });
  };

  const handleEditChange = (e, id) => {
    const { name, value } = e.target;
    setEditQuestions((prev) => ({
      ...prev,
      [id]: { ...prev[id], [name]: value },
    }));
  };

  const handleEditQuestion = (e, id) => {
    e.preventDefault();

    // Ensure that the editQuestions object for this id is passed
    // const updatedQuestion = editQuestions[id];

    const updatedQuestion = {
      question: editQuestions[id],
      unitCode: unitCode,
    };

    // Make sure to check if the question exists before proceeding
    if (updatedQuestion.question) {
      setFetchUrl({
        url: `${import.meta.env.VITE_UPDATE_COURSE_ASSIGNMENT}/${id}`,
        options: {
          method: "PATCH",
          body: updatedQuestion, // Stringify the updated question
          headers: { "Content-Type": "application/json" },
        },
      });
    }
  };
  const handleAnswerChange = (e, id) => {
    const { name, value } = e.target;
    setAnswerQuestions((prev) => ({
      ...prev,
      [id]: { ...prev[id], [name]: value },
    }));
  };

  const handleAnswerQuestion = (e, id) => {
    e.preventDefault();

    const answerQuestion = answerQuestions[id];

    // Add user id (student_id) to the answer before sending
    if (answerQuestion && user?.id) {
      const answerWithUserId = {
        ...answerQuestion,
        student_id: user.id, // Attach the user ID
      };

      setFetchUrl({
        url: `${import.meta.env.VITE_ADD_ANSWER}/${unitCode}/${id}`,
        options: {
          method: "POST",
          body: answerWithUserId, // Make sure to stringify the body
          headers: { "Content-Type": "application/json" },
        },
      });
    }
  };

  const handleDeleteQuestion = (e, id) => {
    e.preventDefault();
    const assignmentId = [id];
    setFetchUrl({
      url: `${
        import.meta.env.VITE_DELETE_COURSE_ASSIGNMENT
      }/${assignmentId}/${unitCode}`,
      options: {
        method: "DELETE",
      },
    });
  };

  useEffect(() => {
    document.title = "Class Link | Assignment";

    if (data) {
      setCourse(data.course);
      setAnswered(data.ans); // Ensure answered is set first

      if (data.assignment && data.ans && userRole === "student") {
        const filteredAssignments = data.assignment.filter((assignment) => {
          // Check if the assignment has been answered by the student with status 'ans'
          const isAnswered = data.ans.some(
            (a) =>
              a.assignments_id === assignment.id &&
              a.student_id === user.id &&
              a.status === "ans"
          );
          return !isAnswered;
        });
        setAssignment(filteredAssignments);
      } else if (userRole !== "student") {
        // If not a student, set all assignments
        setAssignment(data.assignment);
      }
    }
  }, [data, userRole, user.id]);

  return (
    <div className="container my-4">
      {loading && !assignment && !error && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {error && !loading && !assignment && (
        <div className="alert alert-danger" role="alert">
          {error.message}
        </div>
      )}
      {assignment && (
        <div>
          <h3>
            {course.unit_code} - {course.course_title}
          </h3>

          {userRole !== "student" && user?.id === course.teacher_id && (
            <button
              className="btn btn-sm btn-outline-primary view-btn w-75 my-3"
              data-bs-toggle="collapse"
              href="#addQuestion"
            >
              Add Question
            </button>
          )}

          <div className="collapse w-75 my-3" id="addQuestion">
            <form onSubmit={handleAddQuestion}>
              <div className="form-group">
                <label>Question</label>
                <textarea
                  name="question"
                  className="form-control mt-2"
                  value={addQuestion.question}
                  onChange={handleInputChange}
                />
              </div>

              <div className="row g-2 w-100">
                <div className="col-lg-6">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary w-100"
                    data-bs-toggle="collapse"
                    href="#addQuestion"
                  >
                    Cancel
                  </button>
                </div>
                <div className="col-lg-6">
                  <button
                    type="submit"
                    className="btn btn-sm btn-info w-100 text-white"
                    data-bs-toggle="collapse"
                    href="#addQuestion"
                  >
                    Add Question
                  </button>
                </div>
              </div>
            </form>
          </div>
          {assignment.map((assignment, idx) => (
            <div key={assignment.id}>
              <p className="w-75">
                <strong className="me-2">{idx + 1}.</strong>
                {assignment.question}
              </p>
              <div className="row my-3">
                {userRole !== "student" && user?.id === course.teacher_id && (
                  <>
                    <div className="col-lg-3">
                      <button
                        className="btn btn-sm btn-outline-primary view-btn w-100"
                        data-bs-toggle="collapse"
                        href={`#editQuestion${assignment.id}`}
                      >
                        Edit
                      </button>
                    </div>
                    <div className="col-lg-3">
                      <button
                        className="btn btn-sm btn-outline-danger view-btn w-100"
                        data-bs-toggle="collapse"
                        href={`#deleteQuestion${assignment.id}`}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
                {userRole === "student" && (
                  <div className="col-lg-3">
                    <button
                      className="btn btn-sm btn-outline-primary view-btn w-100"
                      data-bs-toggle="collapse"
                      href={`#answerQuestion${assignment.id}`}
                    >
                      Answer
                    </button>
                  </div>
                )}

                <div
                  className="collapse col-lg-12"
                  id={`editQuestion${assignment.id}`}
                >
                  <div className="w-75 my-3">
                    <form
                      onSubmit={(e) => handleEditQuestion(e, assignment.id)}
                    >
                      <div className="form-group">
                        <label>Question</label>
                        <textarea
                          name="question"
                          className="form-control mt-2"
                          value={
                            editQuestions[assignment.id]?.question ||
                            assignment.question
                          }
                          onChange={(e) => handleEditChange(e, assignment.id)}
                        />
                      </div>

                      <div className="row g-2 w-50">
                        <div className="col-lg-6">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary w-100"
                            data-bs-toggle="collapse"
                            href={`#editQuestion${assignment.id}`}
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="col-lg-6">
                          <button
                            type="submit"
                            className="btn btn-sm btn-info w-100 text-white"
                            data-bs-toggle="collapse"
                            href={`#editQuestion${assignment.id}`}
                          >
                            Edit Question
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div
                  className="collapse col-lg-12"
                  id={`answerQuestion${assignment.id}`}
                >
                  <div className="w-75 my-3">
                    <form
                      onSubmit={(e) => handleAnswerQuestion(e, assignment.id)}
                    >
                      <div className="form-group">
                        <textarea
                          name="answer"
                          className="form-control"
                          placeholder="type answer here..."
                          value={answerQuestions[assignment.id]?.answer || ""}
                          onChange={(e) => handleAnswerChange(e, assignment.id)}
                        ></textarea>
                      </div>

                      <div className="row g-2 w-50">
                        <div className="col-lg-6">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary w-100"
                            data-bs-toggle="collapse"
                            href={`#answerQuestion${assignment.id}`}
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="col-lg-6">
                          <button
                            type="submit"
                            className="btn btn-sm btn-info w-100 text-white"
                          >
                            Add Answer
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div
                  className="collapse col-lg-12"
                  id={`deleteQuestion${assignment.id}`}
                >
                  <div className="w-75 my-3">
                    <form>
                      <div className="form-group">
                        <p>
                          Are you sure you want to delete Question{" "}
                          {assignment.id}?
                        </p>
                      </div>

                      <div className="row g-2 w-50">
                        <div className="col-lg-6">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary w-100"
                            data-bs-toggle="collapse"
                            href={`#deleteQuestion${assignment.id}`}
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="col-lg-6">
                          <button
                            type="submit"
                            className="btn btn-sm btn-danger w-100 text-white"
                            data-bs-toggle="collapse"
                            href={`#deleteQuestion${assignment.id}`}
                            onClick={(e) => {
                              handleDeleteQuestion(e, assignment.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentDetail;
