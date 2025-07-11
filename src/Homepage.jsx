import React from "react";
import { Container, Button } from "react-bootstrap";
import { useStudents } from "./Context/StudentContext";
import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import { ToastContainer } from 'react-toastify';

function Homepage() {
    const { setShowModal } = useStudents();
    return (
        <div>
            <Container className="mt-5">
                <div className="mb-5">
                    <h2 className="text-center mb-4">Student Result</h2>
                    <Button onClick={() => setShowModal(true)}>Add Student</Button>
                </div>
                <StudentTable />
                <StudentForm />
                <ToastContainer position="bottom-right" autoClose={3000} />
            </Container>
        </div>
    );
}

export default Homepage;
