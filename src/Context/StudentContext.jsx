import React, { createContext, useContext, useState } from "react";

const StudentContext = createContext();
export const useStudents = () => useContext(StudentContext);

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ name: "", subjects: [{ subject: "", marks: "" }] });
  const [showModal, setShowModal] = useState(false);

  const addStudent = () => {
    setStudents([...students, form]);
    resetForm();
  };

  const updateStudent = () => {
    const updated = [...students];
    updated[editIndex] = form;
    setStudents(updated);
    resetForm();
  };

  const deleteStudent = (index) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  const editStudent = (index) => {
    setForm(students[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({ name: "", subjects: [{ subject: "", marks: "" }] });
    setEditIndex(null);
    setShowModal(false);
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        form,
        setForm,
        addStudent,
        updateStudent,
        deleteStudent,
        editStudent,
        editIndex,
        showModal,
        setShowModal,
        resetForm
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
