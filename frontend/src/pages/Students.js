import React, { useEffect, useState, useCallback } from 'react';
import { getStudents, deleteStudent, createStudent, updateStudent, getCourses, createEnrollment, getEnrollments, deleteEnrollment } from '../api';

function AddStudentModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ 
    first_name: '', 
    last_name: '', 
    student_id: '', 
    email: '', 
    age: '', 
    gender: 'M' 
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!form.first_name || !form.last_name || !form.student_id || !form.email || !form.age) {
      setError('All fields are required.'); 
      return;
    }
    
    setSaving(true);
    
    try {
      const studentData = { ...form, age: parseInt(form.age) };
      await createStudent(studentData);
      onCreated();
    } catch (e) {
      let data = null;
      if (e.response && e.response.data) {
        data = e.response.data;
      }

      if (data) {
        let errorMessage = '';
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const field = keys[i];
          let msg = data[field];
          if (Array.isArray(msg)) {
            msg = msg[0];
          }
          errorMessage = errorMessage + field + ': ' + msg;
          if (i < keys.length - 1) {
            errorMessage = errorMessage + ', ';
          }
        }
        setError(errorMessage);
      } else {
        setError('Error creating student. Please try again.');
      }
    } finally { 
      setSaving(false); 
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="card" style={{ width: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex justify-between items-center mb-24">
          <h2 style={{ fontSize: 18, fontWeight: 'bold' }}>Add Student</h2>
          <button className="btn btn-ghost" style={{ padding: '4px 10px' }} onClick={onClose}>X</button>
        </div>
        
        {error ? (
          <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 16, padding: '10px 14px', background: '#fee2e2', borderRadius: 6, border: '1px solid #fca5a5' }}>
            {error}
          </div>
        ) : null}
        
        <div className="form-grid form-grid-2">
          <div className="form-group">
            <label>First Name</label>
            <input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} placeholder="Alexandros" />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} placeholder="Papadopoulos" />
          </div>
          <div className="form-group">
            <label>Student ID</label>
            <input value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} placeholder="STU2025001" />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="20" onWheel={e => e.target.blur()} />
          </div>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="student@university.edu" />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>
        <div className="flex gap-8" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? 'Saving...' : 'Add Student'}</button>
        </div>
      </div>
    </div>
  );
}

function EditStudentModal({ student, onClose, onSaved }) {
  const nameParts = student.full_name.split(' ');
  const initialFirstName = nameParts[0];
  let initialLastName = '';
  if (nameParts.length > 1) {
    const lastParts = nameParts.slice(1);
    initialLastName = lastParts.join(' ');
  }

  const [form, setForm] = useState({
    first_name: initialFirstName,
    last_name: initialLastName,
    student_id: student.student_id,
    email: student.email,
    age: student.age,
    gender: student.gender,
  });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!form.first_name || !form.last_name || !form.student_id || !form.email || !form.age) {
      setError('All fields are required.'); 
      return;
    }
    
    setSaving(true);
    
    try {
      const updateData = { ...form, age: parseInt(form.age) };
      await updateStudent(student.id, updateData);
      onSaved();
    } catch (e) {
      let data = null;
      if (e.response && e.response.data) {
        data = e.response.data;
      }

      if (data) {
        let errorMessage = '';
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const field = keys[i];
          let msg = data[field];
          if (Array.isArray(msg)) {
            msg = msg[0];
          }
          errorMessage = errorMessage + field + ': ' + msg;
          if (i < keys.length - 1) {
            errorMessage = errorMessage + ', ';
          }
        }
        setError(errorMessage);
      } else {
        setError('Error updating student. Please try again.');
      }
    } finally { 
      setSaving(false); 
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="card" style={{ width: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex justify-between items-center mb-24">
          <h2 style={{ fontSize: 18, fontWeight: 'bold' }}>Edit Student</h2>
          <button className="btn btn-ghost" style={{ padding: '4px 10px' }} onClick={onClose}>X</button>
        </div>
        
        {error ? (
          <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 16, padding: '10px 14px', background: '#fee2e2', borderRadius: 6, border: '1px solid #fca5a5' }}>
            {error}
          </div>
        ) : null}
        
        <div className="form-grid form-grid-2">
          <div className="form-group">
            <label>First Name</label>
            <input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Student ID</label>
            <input value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} onWheel={e => e.target.blur()} />
          </div>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>
        <div className="flex gap-8" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
}

function EnrollModal({ student, courses, onClose }) {
  const [enrollments, setEnrollments] = useState([]);
  const [form, setForm] = useState({
    course: '', 
    semester: '2024-S2', 
    study_hours_per_week: 8,
    attendance_percentage: 80, 
    midterm_score: 65,
    assignment_avg: 70, 
    previous_gpa: 2.5, 
    result: 'pending'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const response = await getEnrollments({ student: student.id });
        setEnrollments(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchEnrollments();
  }, [student.id]);

  const submit = async () => {
    if (!form.course) { 
      setError('Please select a course.'); 
      return; 
    }
    
    setSaving(true);
    
    try {
      const payload = { ...form, student: student.id };
      const res = await createEnrollment(payload);
      
      const newEnrollments = [...enrollments, res.data];
      setEnrollments(newEnrollments);
      setError('');
    } catch (e) {
      let data = null;
      if (e.response && e.response.data) {
        data = e.response.data;
      }

     if (data) {
       if (data.non_field_errors) {
        setError('This student is already enrolled in this course.');
       } else {
        setError('Error adding enrollment.');
        }
      } else {
        setError('Error adding enrollment.');
      }
    } finally { 
      setSaving(false); 
    }
  };

  const removeEnrollment = async (id) => {
    try {
      await deleteEnrollment(id);
      const filtered = enrollments.filter(x => x.id !== id);
      setEnrollments(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="card" style={{ width: 600, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex justify-between items-center mb-16">
          <h2 style={{ fontSize: 18, fontWeight: 'bold' }}>Enrollments — {student.full_name}</h2>
          <button className="btn btn-ghost" style={{ padding: '4px 10px' }} onClick={onClose}>X</button>
        </div>

        {enrollments.length > 0 ? (
          <div className="table-container mb-24">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Midterm</th>
                  <th>Attendance</th>
                  <th>Result</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e) => {
                  return (
                    <tr key={e.id}>
                      <td>{e.course_code}</td>
                      <td>{e.midterm_score}</td>
                      <td>{e.attendance_percentage}%</td>
                      <td><span className={`badge badge-${e.result}`}>{e.result}</span></td>
                      <td>
                        <button className="btn btn-danger" style={{ padding: '3px 8px', fontSize: 12 }} onClick={() => removeEnrollment(e.id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="section-title">Add Enrollment</div>
        
        {error ? (
          <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 12, padding: '8px 12px', background: '#fee2e2', borderRadius: 6 }}>
            {error}
          </div>
        ) : null}
        
        <div className="form-group">
          <label>Course</label>
          <select value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}>
            <option value="">Select a course...</option>
            {courses.map((c) => {
              return <option key={c.id} value={c.id}>{c.code} — {c.name}</option>;
            })}
          </select>
        </div>
        <div className="form-grid form-grid-2">
          <div className="form-group">
            <label>Study Hours/Week</label>
            <input type="number" step="0.5" value={form.study_hours_per_week} onChange={e => setForm({ ...form, study_hours_per_week: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Attendance %</label>
            <input type="number" value={form.attendance_percentage} onChange={e => setForm({ ...form, attendance_percentage: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Midterm Score</label>
            <input type="number" value={form.midterm_score} onChange={e => setForm({ ...form, midterm_score: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Assignment Average</label>
            <input type="number" value={form.assignment_avg} onChange={e => setForm({ ...form, assignment_avg: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Previous GPA</label>
            <input type="number" step="0.1" max="4" value={form.previous_gpa} onChange={e => setForm({ ...form, previous_gpa: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Result</label>
            <select value={form.result} onChange={e => setForm({ ...form, result: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
            </select>
          </div>
        </div>
        <div className="flex gap-8" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? 'Adding...' : 'Add Enrollment'}</button>
        </div>
      </div>
    </div>
  );
}

export default function Students() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [enrollTarget, setEnrollTarget] = useState(null);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const sRes = await getStudents();
      const cRes = await getCourses();
      setStudents(sRes.data);
      setCourses(cRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  let filtered = [];
  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    const nameMatch = s.full_name.toLowerCase().includes(search.toLowerCase());
    const idMatch = s.student_id.toLowerCase().includes(search.toLowerCase());
    if (nameMatch || idMatch) {
      filtered.push(s);
    }
  }

  const remove = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (confirmDelete) {
      try {
        await deleteStudent(id);
        const newStudents = students.filter(x => x.id !== id);
        setStudents(newStudents);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" /> Loading students...
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-24">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>{students.length} students enrolled</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Student</button>
      </div>

      <div style={{ marginBottom: 16, maxWidth: 300 }}>
        <input placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Enrollments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              let genderText = 'Other';
              if (s.gender === 'M') {
                genderText = 'Male';
              } else if (s.gender === 'F') {
                genderText = 'Female';
              }

              return (
                <tr key={s.id}>
                  <td>{s.student_id}</td>
                  <td style={{ fontWeight: 'bold' }}>{s.full_name}</td>
                  <td style={{ color: '#666' }}>{s.email}</td>
                  <td>{s.age}</td>
                  <td>{genderText}</td>
                  <td>{s.enrollment_count}</td>
                  <td>
                    <div className="flex gap-8">
                      <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 13 }} onClick={() => setEditTarget(s)}>
                        Edit
                      </button>
                      <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 13 }} onClick={() => setEnrollTarget(s)}>
                        Enrollments
                      </button>
                      <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: 13 }} onClick={() => remove(s.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">No students found.</div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {showAdd ? (
        <AddStudentModal
          onClose={() => setShowAdd(false)}
          onCreated={() => { 
            setShowAdd(false); 
            loadStudents(); 
          }}
        />
      ) : null}
      
      {editTarget ? (
        <EditStudentModal
          student={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => { 
            setEditTarget(null); 
            loadStudents(); 
          }}
        />
      ) : null}
      
      {enrollTarget ? (
        <EnrollModal 
          student={enrollTarget} 
          courses={courses} 
          onClose={() => { 
            setEnrollTarget(null); 
            loadStudents(); 
          }} 
        />
      ) : null}
    </div>
  );
}