import React, { useEffect, useState } from 'react';
import { getPredictions } from '../api';

export default function PredictionLog() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogData() {
      try {
        const response = await getPredictions();
        setPredictions(response.data);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLogData();
  }, []);

  const formatTheDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getBarColor = (result) => {
    if (result === 'pass') {
      return 'var(--success)';
    } else {
      return 'var(--danger)';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" /> Loading log...
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Prediction Log</h1>
      <p className="page-subtitle">{predictions.length} predictions stored — full audit trail of all AI outputs</p>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Study Hrs</th>
              <th>Attendance</th>
              <th>Midterm</th>
              <th>Assign. Avg</th>
              <th>Prev GPA</th>
              <th>Prediction</th>
              <th>Confidence</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Students usually use the explicit 'return' inside a map function */}
            {predictions.map((p) => {
              
              // Breaking down the math before returning the HTML
              let confPercent = p.confidence * 100;
              let confString = confPercent.toFixed(0) + "%";
              
              
              const nameStyle = { 
                maxWidth: 140, 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap' 
              };

              return (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                    #{p.id}
                  </td>
                  
                  <td style={nameStyle}>
                    {p.student_name ? p.student_name : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{p.study_hours}h</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{p.attendance}%</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{p.midterm_score}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{p.assignment_avg}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{p.previous_gpa}</td>
                  
                  <td>
                    <span className={`badge badge-${p.predicted_result}`}>
                      {p.predicted_result}
                    </span>
                  </td>
                  
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 48, height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          width: confString, 
                          height: '100%',
                          background: getBarColor(p.predicted_result),
                          borderRadius: 2
                        }} />
                      </div>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
                        {confString}
                      </span>
                    </div>
                  </td>
                  
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {formatTheDate(p.created_at)}
                  </td>
                </tr>
              );
            })}
            
            {predictions.length === 0 ? (
              <tr>
                <td colSpan={10}>
                  <div className="empty-state">No predictions yet. Use the AI Predictor to generate some.</div>
                </td>
              </tr>
            ) : null}
            
          </tbody>
        </table>
      </div>
    </div>
  );
}