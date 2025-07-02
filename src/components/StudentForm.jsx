import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { toast } from 'react-toastify';
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
  // const [invalid, setInValid] = useState(false);
  const [invalid, setInValid] = useState([]);
  const [nameError, setNameError] = useState("");

  // Name Function 
  const handleName = (value) => {
    if (/\d/.test(value)) {
      setNameError("*Name should not contain numbers");
      toast.error("Name should not contain numbers!");
    }
    else {
      setNameError("");
      setForm({ ...form, name: value })
    }
  }

  // Subjects and Marks Function
  const handleChange = (i, field, value) => {
    const updated = [...form.subjects];
    const updatedinvalid = [...invalid];
    if (!updatedinvalid[i]) updatedinvalid[i] = { subject: "", marks: "" };
    if (field === "subject") {
      if (/[^a-zA-Z\s]/.test(value)) {
        updatedinvalid[i].subject = "*Subject should contain only letters";
        toast.error("Subject should contain only letters!");
      } else {
        updatedinvalid[i].subject = "";
        updated[i][field] = value;
      }
    }
    if (field === "marks") {
      updated[i][field] = value;

      // Here Check Value is Number or not
      if (/^\d{1,3}$/.test(value)) {
        const num = Number(value);
        if (num >= 0 && num <= 100) {
          updatedinvalid[i].marks = "";
        } else {
          updatedinvalid[i].marks = "*Marks must be between 0 and 100";
        }
      } else if (value === "") {
        updatedinvalid[i].marks = "";
      } else {
        updatedinvalid[i].marks = "*Marks must be a valid number";
      }
    }
    setForm({ ...form, subjects: updated });
    setInValid(updatedinvalid);
  };

  // Add and Remove Subject Function
  const addSubject = () => {
    setForm({ ...form, subjects: [...form.subjects, { subject: "", marks: "" }] });
  };
  const removeSubject = (i) => {
    const updated = form.subjects.filter((_, idx) => idx !== i);
    setForm({ ...form, subjects: updated });
  };

  // Form Submit Function
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required!");
      return;
    }
    if (/\d/.test(form.name)) {
      toast.error("Name should not contain numbers!");
      return;
    }

    // Here Check Value is empty or NotaNumber or not integer or below of 0 or above of 100
    const invalidMarks = form.subjects.some(sub => {
      const num = Number(sub.marks);
      return sub.marks === "" || isNaN(num) || !Number.isInteger(num) || num < 0 || num > 100;
    });
    if (invalidMarks) {
      toast.error("Marks should be numeric.");
      return;
    }
    editIndex !== null ? updateStudent() : addStudent();
  };

  return (
    <Modal show={showModal} onHide={resetForm} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{editIndex !== null ? "Edit" : "Add"} Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-1">
            <Form.Label className="fw-medium">Student Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => handleName(e.target.value)}
              required
            />
          </Form.Group>
          {/* {inValid && <p className="text-danger">*Name must be String</p>} */}
          {nameError && <p className="text-danger">{nameError}</p>}
          <div className="d-flex column-gap-3 mt-3">
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
                  className="mb-1"
                  required
                />
                {/* {invalid && (<p className="text-danger">*Subject must be String</p>)} */}
                {invalid[i]?.subject && <p className="text-danger">{invalid[i].subject}</p>}
              </Col>
              <Col md={5}>
                <Form.Control
                  type="text"
                  // min="0"
                  // max="100"
                  // step="1"
                  placeholder="Marks"
                  value={item.marks}
                  onChange={(e) => handleChange(i, "marks", e.target.value)}
                  className="mb-1"
                  // onKeyDown={(e) => {
                  //   // Block 'e', 'E', '.', '+', and '-' keys
                  //   if (["e", "E", ".", "+", "-"].includes(e.key)) {
                  //     e.preventDefault();
                  //   }
                  // }}
                  required
                />
                {/* {invalid && (<p className="text-danger">*Marks must be String</p>)} */}
                {invalid[i]?.marks && <p className="text-danger">{invalid[i].marks}</p>}
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
