import React from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useStudents } from "../Context/StudentContext";

const StudentForm = () => {
  const {
    form,
    setForm,
    showModal,
    addStudent,
    updateStudent,
    editIndex,
    resetForm,
  } = useStudents();

  const handleChange = (i, field, value) => {
    const updated = [...form.subjects];
    updated[i][field] = value;
    setForm({ ...form, subjects: updated });
  };

  const addSubject = () => {
    setForm({ ...form, subjects: [...form.subjects, { subject: "", marks: "" }] });
  };

  const removeSubject = (i) => {
    const updated = form.subjects.filter((_, idx) => idx !== i);
    setForm({ ...form, subjects: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editIndex !== null ? updateStudent() : addStudent();
  };

  return (
    <Modal show={showModal} onHide={resetForm} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{editIndex !== null ? "Edit" : "Add"} Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium">Student Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Form.Group>
          <div className="d-flex column-gap-3">
            <Col md={5}>
              <Form.Label className="fw-medium">Subjects</Form.Label>
            </Col>
            <Col md={5}>
              <Form.Label className="fw-medium">Marks</Form.Label>
            </Col>
          </div>
          {form.subjects.map((item, i) => (
            <Row key={i} className="mb-2">
              <Col md={5}>
                <Form.Control
                  type="text"
                  placeholder="Subject"
                  value={item.subject}
                  onChange={(e) => handleChange(i, "subject", e.target.value)}
                  required
                />
              </Col>
              <Col md={5}>
                <Form.Control
                  type="number"
                  placeholder="Marks"
                  value={item.marks}
                  onChange={(e) => handleChange(i, "marks", e.target.value)}
                  required
                />
              </Col>
              <Col md={2} className="d-flex align-items-end justify-content-start">
                {form.subjects.length > 1 && (
                  <Button variant="danger" onClick={() => removeSubject(i)}>
                    X
                  </Button>
                )}
              </Col>
            </Row>
          ))}
          <Button variant="secondary" onClick={addSubject} className="my-2">+ Add Subject</Button>
          <div className="text-center">
            <Button variant="success" type="submit">
              {editIndex !== null ? "Update" : "Add"} Student
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal >
  );
};

export default StudentForm;
