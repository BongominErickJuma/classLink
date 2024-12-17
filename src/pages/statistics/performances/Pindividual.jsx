import React from "react";

const Pindividual = ({ courses, performance }) => {
  return (
    <table className="table table-primary">
      <thead>
        <tr>
          <th scope="col">
            <div className="ms-1">Unit Code</div>
          </th>
          <th scope="col">Subject</th>
          <th scope="col" className="text-center">
            Assignment (Average %)
          </th>
          <th scope="col" className="text-center">
            Exams (%)
          </th>
          <th scope="col" className="text-center">
            Total (Average %)
          </th>
        </tr>
      </thead>
      <tbody>
        {courses.map((c) => {
          // Filter performance data for the current course
          const filteredPerformance = performance.filter(
            (p) => p.course_name === c.course_title
          );

          // Get total marks and number of entries for the average calculation
          const totalMarks = filteredPerformance.reduce(
            (acc, curr) => acc + curr.marks,
            0
          );
          const performanceCount = filteredPerformance.length;

          // Calculate average only if performance entries exist
          const averageMarks =
            performanceCount > 0 ? totalMarks / performanceCount : "na";

          return (
            <tr key={c.id}>
              <td>{c.unit_code}</td>
              <td>{c.course_title}</td>
              <td className="text-center">{averageMarks}</td>
              <td className="text-center">na</td>
              <td className="text-center">{averageMarks}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Pindividual;
