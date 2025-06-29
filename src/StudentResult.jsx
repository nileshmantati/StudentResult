import React, { useState } from "react";
import { Container, Table, Button, Form, Row, Col, Modal } from "react-bootstrap";

function StudentResult() {
    const [students, setStudents] = useState([]);
    const [form, setForm] = useState({ name: "", subjects: [{ subject: "", marks: "" }] });
    const [editIndex, setEditIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Handle name change
    const handleNameChange = (e) => {
        setForm({ ...form, name: e.target.value });
    };

    // Handle individual subject change
    const handleSubjectChange = (index, field, value) => {
        const updatedSubjects = [...form.subjects];
        updatedSubjects[index][field] = value;
        setForm({ ...form, subjects: updatedSubjects });
    };

    // Add new subject row
    const addSubjectRow = () => {
        setForm({ ...form, subjects: [...form.subjects, { subject: "", marks: "" }] });
    };

    // Remove subject row
    const removeSubjectRow = (index) => {
        const updatedSubjects = form.subjects.filter((_, i) => i !== index);
        setForm({ ...form, subjects: updatedSubjects });
    };

    // Submit form
    const handleSubmit = (e) => {
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

    const handleEdit = (index) => {
        setForm(students[index]);
        setEditIndex(index);
        setShowModal(true);
    };

    const handleDelete = (index) => {
        const filtered = students.filter((_, i) => i !== index);
        setStudents(filtered);
    };

    const allSubjects = [];
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
                <Button onClick={() => {
                    setShowModal(true);
                    setEditIndex(null);
                    setForm({ name: "", subjects: [{ subject: "", marks: "" }] });
                }}>
                    Add Student
                </Button>
                {students.length > 0 && (
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? (
                                students.map((student, idx) => {
                                    const subjectsMap = {};
                                    student.subjects.forEach(sub => {
                                        subjectsMap[sub.subject] = Number(sub.marks);
                                    });

                                    let allSubjects = [];
                                    students.forEach(student => {
                                        student.subjects.forEach(sub => {
                                            if (!allSubjects.includes(sub.subject)) {
                                                allSubjects.push(sub.subject);
                                            }
                                        });
                                    });

                                    const marksList = allSubjects.map(sub => subjectsMap[sub] || "-");
                                    const total = marksList.reduce((acc, val) => acc + (val !== "-" ? parseFloat(val) : 0), 0);
                                    const count = marksList.filter(val => val !== "-").length;
                                    const avg = count > 0 ? (total / count).toFixed(2) : 0;

                                    let grade = "F";
                                    if (avg >= 90) grade = "A+";
                                    else if (avg >= 80) grade = "A";
                                    else if (avg >= 70) grade = "B";
                                    else if (avg >= 60) grade = "C";
                                    else if (avg >= 50) grade = "D";

                                    return (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>{student.name}</td>
                                            {marksList.map((m, i) => (
                                                <td key={i}>{m}</td>
                                            ))}
                                            <td>{total}</td>
                                            <td>{avg}%</td>
                                            <td>{grade}</td>
                                            <td>
                                                <Button variant="warning" size="sm" onClick={() => handleEdit(idx)}>Edit</Button>{" "}
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(idx)}>Delete</Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan="100%" className="text-center">No students found</td></tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editIndex !== null ? "Edit" : "Add"} Student</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Student Name</Form.Label>
                            <Form.Control type="text" value={form.name} onChange={handleNameChange} required />
                        </Form.Group>

                        <h5>Subjects</h5>
                        {form.subjects.map((item, index) => (
                            <Row key={index} className="mb-3">
                                <Col md={5}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Subject"
                                        value={item.subject}
                                        onChange={(e) => handleSubjectChange(index, "subject", e.target.value)}
                                        required
                                    />
                                </Col>
                                <Col md={5}>
                                    <Form.Control
                                        type="number"
                                        placeholder="Marks"
                                        value={item.marks}
                                        onChange={(e) => handleSubjectChange(index, "marks", e.target.value)}
                                        required
                                    />
                                </Col>
                                <Col md={2}>
                                    {form.subjects.length > 1 && (
                                        <Button variant="danger" onClick={() => removeSubjectRow(index)}>-</Button>
                                    )}
                                </Col>
                            </Row>
                        ))}
                        <Button variant="secondary" onClick={addSubjectRow} className="mb-3">+ Add Subject</Button><br />
                        <Button type="submit" variant="primary" >
                            {editIndex !== null ? "Update" : "Add"} Student
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default StudentResult;
