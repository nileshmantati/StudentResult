import React from "react";
import { Button, Table } from "react-bootstrap";
import { useStudents } from "../Context/StudentContext";

const StudentTable = () => {
  const {
    students,
    deleteStudent,
    editStudent,
  } = useStudents();

  const allSubjects = [...new Set(students.flatMap(s => s.subjects.map(sub => sub.subject)))];

  const calculateTotal = (subjects) =>
    subjects.reduce((sum, sub) => sum + Number(sub.marks), 0);

  const calculateAverage = (subjects) => {
    const total = calculateTotal(subjects);
    const count = subjects.length;
    return count ? parseFloat((total / count).toFixed(2)) : 0;
  };
  return (
    <div>
      <h4 className="text-center">Student List</h4>
      <Table striped bordered hover responsive className="mt-2">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            {allSubjects.map((sub, i) => (
              <th key={i}>{sub}</th>
            ))}
            <th>Total</th>
            <th>Average</th>
            <th>Grade</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => {
              const marksList = allSubjects.map(sub => {
                const found = student.subjects.find(s => s.subject === sub);
                return found ? +found.marks : "-";
              });
              const total = calculateTotal(student.subjects);
              const avg = calculateAverage(student.subjects);

              let grade = "F";
              if (avg >= 90) grade = "A+";
              else if (avg >= 80) grade = "A";
              else if (avg >= 70) grade = "B";
              else if (avg >= 60) grade = "C";
              else if (avg >= 50) grade = "D";

              const status = marksList.some(m => m !== "-" && m < 35) ? "Fail" : "Pass";

              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  {marksList.map((m, i) => (
                    <td key={i}>{m}</td>
                  ))}
                  <td>{total}</td>
                  <td>{avg}%</td>
                  <td>{grade}</td>
                  <td style={{ color: status === "Fail" ? "red" : "green" }}>{status}</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => editStudent(index)}>
                      Edit
                    </Button>{" "}
                    <Button variant="danger" size="sm" onClick={() => deleteStudent(index)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8 + allSubjects.length} className="text-center">No students added yet.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default StudentTable;
