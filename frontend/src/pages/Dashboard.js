import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { getStudentStats, getEnrollments } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_students: 0, 
    pass_count: 0, 
    fail_count: 0,
    pending_count: 0, 
    pass_rate: 0, 
    avg_attendance: 0,
    avg_study_hours: 0, 
    avg_midterm_score: 0,
  });
  
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsRes = await getStudentStats();
        if (statsRes?.data) {
          setStats(statsRes.data);
        }

        // Fetch enrollments
        const enrollRes = await getEnrollments();
        if (enrollRes?.data) {
          setEnrollments(enrollRes.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" /> Loading...
      </div>
    );
  }

  const passFailData = [
    { name: 'Pass', count: stats.pass_count || 0 },
    { name: 'Fail', count: stats.fail_count || 0 },
    { name: 'Pending', count: stats.pending_count || 0 },
  ];

  // Calculate attendance distribution
  let bucket1 = 0; // 0-50
  let bucket2 = 0; // 50-65
  let bucket3 = 0; // 65-80
  let bucket4 = 0; // 80-90
  let bucket5 = 0; // 90-100

  enrollments.forEach(student => {
    const att = student.attendance_percentage;
    if (att < 50) {
      bucket1 += 1;
    } else if (att >= 50 && att < 65) {
      bucket2 += 1;
    } else if (att >= 65 && att < 80) {
      bucket3 += 1;
    } else if (att >= 80 && att < 90) {
      bucket4 += 1;
    } else {
      bucket5 += 1;
    }
  });

  const attendanceData = [
    { name: '0-50', count: bucket1 },
    { name: '50-65', count: bucket2 },
    { name: '65-80', count: bucket3 },
    { name: '80-90', count: bucket4 },
    { name: '90-100', count: bucket5 },
  ];

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Overview of all student performance data</p>

      <div className="card-grid card-grid-4 mb-24">
        <div className="stat-card">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{stats.total_students}</div>
          <div className="stat-sub">enrolled</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pass Rate</div>
          <div className="stat-value">{stats.pass_rate}%</div>
          <div className="stat-sub">{stats.pass_count} students passing</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Failing</div>
          <div className="stat-value">{stats.fail_count}</div>
          <div className="stat-sub">at risk</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Attendance</div>
          <div className="stat-value">{stats.avg_attendance}%</div>
          <div className="stat-sub">across all courses</div>
        </div>
      </div>

      <div className="card-grid card-grid-3 mb-24">
        <div className="stat-card">
          <div className="stat-label">Avg Study Hours</div>
          <div className="stat-value">{stats.avg_study_hours}</div>
          <div className="stat-sub">per week</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Midterm Score</div>
          <div className="stat-value">{stats.avg_midterm_score}</div>
          <div className="stat-sub">out of 100</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Results</div>
          <div className="stat-value">{stats.pending_count}</div>
          <div className="stat-sub">not yet assessed</div>
        </div>
      </div>

      <div className="card-grid card-grid-2">
        <div className="card">
          <div className="section-title">Pass / Fail / Pending</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={passFailData} isAnimationActive={false} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#555' }} />
              <YAxis tick={{ fontSize: 12, fill: '#555' }} />
              <Tooltip cursor={false} />
              <Bar dataKey="count" fill="#2563eb" isAnimationActive={false} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="section-title">Attendance Distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attendanceData} isAnimationActive={false} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#555' }} />
              <YAxis tick={{ fontSize: 12, fill: '#555' }} />
              <Tooltip cursor={false} />
              <Bar dataKey="count" fill="#2563eb" isAnimationActive={false} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}