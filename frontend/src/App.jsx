import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/students";
const emptyForm = { name: "", email: "", course: "" };

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load students.");
      setStudents(await response.json());
    } catch {
      setError("Could not connect to the backend. Make sure PostgreSQL and Spring Boot are running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        let message = "Unable to save student.";
        try {
          const body = await response.json();
          if (body.detail) message = body.detail;
          else if (body.message) message = body.message;
          else if (body.title) message = body.title;
        } catch {
          // Keep the fallback message for a non-JSON response.
        }
        throw new Error(message);
      }

      setNotice(editingId ? "Student updated successfully." : "Student added successfully.");
      resetForm();
      await loadStudents();
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(student) {
    setEditingId(student.id);
    setForm({ name: student.name, email: student.email, course: student.course });
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteStudent(student) {
    if (!window.confirm(`Delete ${student.name}?`)) return;
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${API_URL}/${student.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to delete student.");
      setNotice("Student deleted successfully.");
      await loadStudents();
    } catch (err) {
      setError(err.message || "Unable to delete student.");
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <div className="hero-mark">SM</div>
        <div>
          <p className="eyebrow">REACT · SPRING BOOT · POSTGRESQL</p>
          <h1>Student Management</h1>
          <p className="subtitle">A simple full-stack CRUD application</p>
        </div>
      </header>

      <section className="panel form-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">STUDENT DETAILS</p>
            <h2>{editingId ? "Edit student" : "Add a student"}</h2>
          </div>
          {editingId && <button className="button button-light" onClick={resetForm}>Cancel edit</button>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Full name
              <input name="name" value={form.name} onChange={updateField} placeholder="e.g. Deepak Kumar" maxLength="100" required />
            </label>
            <label>
              Email address
              <input name="email" type="email" value={form.email} onChange={updateField} placeholder="name@example.com" maxLength="150" required />
            </label>
            <label className="course-field">
              Course
              <input name="course" value={form.course} onChange={updateField} placeholder="e.g. Java Full Stack" maxLength="100" required />
            </label>
          </div>
          <div className="form-actions">
            <button className="button button-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save changes" : "Add student"}
            </button>
            {!editingId && <button className="button button-light" type="button" onClick={() => setForm(emptyForm)}>Clear form</button>}
          </div>
        </form>

        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {notice && <div className="alert alert-success" role="status">{notice}</div>}
      </section>

      <section className="panel list-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DIRECTORY</p>
            <h2>Students <span className="count">{students.length}</span></h2>
          </div>
          <button className="button button-light" onClick={loadStudents} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="empty-state">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">＋</div>
            <h3>No students yet</h3>
            <p>Add your first student using the form above.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Student</th><th>Email</th><th>Course</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="id-cell">#{student.id}</td>
                    <td className="name-cell">{student.name}</td>
                    <td>{student.email}</td>
                    <td><span className="course-pill">{student.course}</span></td>
                    <td>
                      <div className="row-actions">
                        <button className="text-button edit-button" onClick={() => startEdit(student)}>Edit</button>
                        <button className="text-button delete-button" onClick={() => deleteStudent(student)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer>Student Management · Local development project</footer>
    </main>
  );
}
