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
  const [answered, setAnswered] = useState([]);
  const [unanswered, setUnanswered] = useState([]);
  const [addQuestion, setAddQuestion] = useState({ question: "" });
  const [editQuestions, setEditQuestions] = useState({});
  const [answerQuestions, setAnswerQuestions] = useState({});

  const [fetchUrl, setFetchUrl] = useState({
    url: `${import.meta.env.VITE_GET_COURSE_ASSIGNMENT}/${unitCode}`,
    options: {},
  });
  const { data, error, loading } = useFetch(fetchUrl.url, fetchUrl.options);

  // Handle input for adding questions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddQuestion((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a question
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
    window.location.reload();
  };

  // Handle filtering unanswered questions for students
  const filterUnansweredQuestions = () => {
    if (userRole === "student") {
      const unansweredQuestions = assignment.filter((q) => {
        const hasAnswered = answered.some(
          (ans) => ans.assignment_id === q.id && ans.status === "ans"
        );
        return !hasAnswered;
      });
      setUnanswered(unansweredQuestions);
    }
  };

  // Answer submission logic
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
    if (answerQuestion && user?.id) {
      const answerWithUserId = {
        ...answerQuestion,
        student_id: user.id,
      };
      setFetchUrl({
        url: `${import.meta.env.VITE_ADD_ANSWER}/${unitCode}/${id}`,
        options: {
          method: "POST",
          body: answerWithUserId,
          headers: { "Content-Type": "application/json" },
        },
      });
      window.location.reload();
    }
  };

  useEffect(() => {
    document.title = "Class Link | Assignment";
    if (data) {
      setAssignment(data.assignment);
      setCourse(data.course);
      setAnswered(data.ans);
    }
  }, [data]);

  // Filter unanswered questions when the assignment and answered states are set
  useEffect(() => {
    if (userRole === "student" && assignment && answered) {
      filterUnansweredQuestions();
    }
  }, [userRole, assignment, answered]);

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
                  >
                    Add Question
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Display questions */}
          {(userRole === "student" ? unanswered : assignment).map(
            (assignment, idx) => (
              <div key={assignment.id}>
                <p className="w-75">
                  <strong className="me-2">{idx + 1}.</strong>
                  {assignment.question}
                </p>
                {/* Additional buttons for editing, answering, etc. */}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentDetail;
