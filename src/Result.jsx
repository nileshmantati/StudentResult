import React, { useState } from "react";
import { Container, Table, Button, Form, Row, Col, Modal } from "react-bootstrap";

function Result() {
    const [students, setStudents] = useState([]);
    const [form, setForm] = useState(
        {
            name: "",
            subjects: [{ subject: "", marks: "" }]
        }
    );
    const [editIndex, setEditIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const NameChange = (e) => {
        setForm({ ...form, name: e.target.value });
    };

    const SubjectChange = (index, field, value) => {
        const updatedSubjects = [...form.subjects];
        updatedSubjects[index][field] = value;
        setForm({ ...form, subjects: updatedSubjects });
    };

    const addSubjectRow = () => {
        setForm({ ...form, subjects: [...form.subjects, { subject: "", marks: "" }] });
    };

    const removeSubjectRow = (index) => {
        const updatedSubjects = form.subjects.filter((item, i) => i !== index);
        setForm({ ...form, subjects: updatedSubjects });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (editIndex !== null) {
            const updated = [...students];
            updated[editIndex] = form;
            setStudents(updated);
            setEditIndex(null);
        } else {
            setStudents([...students, form]);
        }
        setForm({ name: "", subjects: [{ subject: "", marks: "" }] });
        setShowModal(false);
    };
    const Edit = (index) => {
        setForm(students[index]);
        setEditIndex(index);
        setShowModal(true);
    };

    const Delete = (index) => {
        const filtered = students.filter((_, i) => i !== index);
        setStudents(filtered);
    };

    let allSubjects = [];
    students.forEach(student => {
        student.subjects.forEach(sub => {
            if (!allSubjects.includes(sub.subject)) {
                allSubjects.push(sub.subject);
            }
        });
    });
    return (
        <Container className="mt-5">
            <div>
                <h2 className="text-center mb-4">Student Result</h2>
                <Button onClick={() =>
                    setShowModal(true)
                }>
                    Add Student
                </Button>
                <Table striped bordered hover responsive className="mt-5">
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

                                let total = 0, count = 0;
                                marksList.forEach(mark => {
                                    if (mark !== "-") {
                                        total += mark;
                                        count++;
                                    }
                                });
                                let avg = 0;
                                if (count > 0) {
                                    avg = (total / count).toFixed(2);
                                }

                                let grade = "F";
                                if (avg >= 90) grade = "A+";
                                else if (avg >= 80) grade = "A";
                                else if (avg >= 70) grade = "B";
                                else if (avg >= 60) grade = "C";
                                else if (avg >= 50) grade = "D";

                                let status = "Pass";
                                for (let mark of marksList) {
                                    if (mark !== "-" && mark < 35) {
                                        status = "Fail";
                                        break;
                                    }
                                }

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
                                        <td>{status}</td>
                                        <td>
                                            <Button variant="warning" size="sm" onClick={() => Edit(index)}>Edit</Button>{" "}
                                            <Button variant="danger" size="sm" onClick={() => Delete(index)}>Delete</Button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="100%" className="text-center">No students found</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editIndex !== null ? "Edit" : "Add"} Student</Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3">
                            <h5 className="mb-3">Student Name</h5>
                            <Form.Control type="text" value={form.name} onChange={NameChange} placeholder="Name" required />
                        </Form.Group>

                        <h5 className="mb-3">Subjects</h5>
                        {form.subjects.map((item, index) => (
                            <Row key={index} className="mb-3">
                                <Col md={5}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Subject"
                                        value={item.subject}
                                        onChange={(e) => SubjectChange(index, "subject", e.target.value)}
                                        required
                                    />
                                </Col>
                                <Col md={5}>
                                    <Form.Control
                                        type="number"
                                        placeholder="Marks"
                                        value={item.marks}
                                        onChange={(e) => SubjectChange(index, "marks", e.target.value)}
                                        required
                                    />
                                </Col>
                                <Col md={2}>
                                    {form.subjects.length > 1 && (
                                        <Button variant="danger" onClick={() => removeSubjectRow(index)}>X</Button>
                                    )}
                                </Col>
                            </Row>
                        ))}
                        <Button variant="secondary" onClick={addSubjectRow} className="mt-2 mb-3">+ Add Subject</Button><br />
                        <div className="text-center">
                            <Button type="submit" variant="success">
                                {editIndex !== null ? "Update" : "Add"} Student
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container >
    );
}

export default Result;
