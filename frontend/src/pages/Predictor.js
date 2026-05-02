import React, { useState, useEffect } from 'react';
import { predict, getModelInfo, trainModel } from '../api';

export default function Predictor() {
  const [form, setForm] = useState({
    study_hours: 8, 
    attendance: 75, 
    midterm_score: 65,
    assignment_avg: 70, 
    previous_gpa: 2.5, 
    student_name: '',
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelInfo, setModelInfo] = useState(null);
  const [training, setTraining] = useState(false);
  const [trainMsg, setTrainMsg] = useState('');

  useEffect(() => {
    async function loadModelData() {
      try {
        const response = await getModelInfo();
        setModelInfo(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    loadModelData();
  }, []);

  const handlePredict = async () => {
    setLoading(true); 
    setResult(null);
    
    try {
      const res = await predict({
        study_hours: form.study_hours, 
        attendance: form.attendance,
        midterm_score: form.midterm_score, 
        assignment_avg: form.assignment_avg,
        previous_gpa: form.previous_gpa, 
        student_name: form.student_name,
      });
      setResult(res.data);
    } catch (e) {
      let errorMsg = 'Prediction failed.';
      if (e.response && e.response.data && e.response.data.error) {
        errorMsg = e.response.data.error;
      }
      alert(errorMsg);
    } finally { 
      setLoading(false); 
    }
  };

  const handleTrain = async () => {
    setTraining(true); 
    setTrainMsg('');
    
    try {
      const res = await trainModel();
      const m = res.data.metrics;
      setTrainMsg(`Done! Accuracy: ${m.accuracy}% on ${m.n_samples} samples.`);
      
      const updatedInfo = await getModelInfo();
      setModelInfo(updatedInfo.data);
    } catch (e) {
      let trainError = e.message;
      if (e.response && e.response.data && e.response.data.error) {
        trainError = e.response.data.error;
      }
      setTrainMsg('Training failed: ' + trainError);
    } finally { 
      setTraining(false); 
    }
  };

  let importances = {};
  if (modelInfo && modelInfo.feature_importances) {
    importances = modelInfo.feature_importances;
  }

  const featureLabels = {
    study_hours_per_week: 'Study Hours / Week',
    attendance_percentage: 'Attendance %',
    midterm_score: 'Midterm Score',
    assignment_avg: 'Assignment Average',
    previous_gpa: 'Previous GPA',
  };

  let sortedFeatures = [];
  if (modelInfo && modelInfo.trained && Object.keys(importances).length > 0) {
    sortedFeatures = Object.entries(importances);
    sortedFeatures.sort((a, b) => {
      return b[1] - a[1];
    });
  }

  let resultBorderColor = '#dc2626';
  let resultBgColor = '#fff5f5';
  let resultTextColor = '#dc2626';
  let passProgressColor = '#dc2626';

  if (result && result.predicted_result === 'pass') {
    resultBorderColor = '#16a34a';
    resultBgColor = '#f0fdf4';
    resultTextColor = '#16a34a';
    passProgressColor = '#16a34a';
  }

  let trainMsgColor = '#dc2626';
  let trainMsgBg = '#fff5f5';
  
  if (trainMsg.includes('Done')) {
    trainMsgColor = '#16a34a';
    trainMsgBg = '#f0fdf4';
  }

  return (
    <div>
      <h1 className="page-title">AI Predictor</h1>

      <div className="card-grid card-grid-2 gap-16">
        <div className="card">
          <div className="form-group">
            <label>Student Name (optional)</label>
            <input 
              value={form.student_name} 
              onChange={e => setForm({ ...form, student_name: e.target.value })} 
              placeholder="e.g. Alexandros Papadopoulos" 
            />
          </div>
          <div className="form-group">
            <label>Study Hours per Week: <strong>{form.study_hours}</strong></label>
            <input 
              type="range" min={0} max={40} step={0.5} 
              value={form.study_hours} 
              onChange={e => setForm({ ...form, study_hours: parseFloat(e.target.value) })} 
              style={{ width: '100%', accentColor: '#2563eb' }} 
            />
            <div className="flex justify-between"><span className="input-hint">0 hrs</span><span className="input-hint">40 hrs</span></div>
          </div>
          <div className="form-group">
            <label>Attendance: <strong>{form.attendance}%</strong></label>
            <input 
              type="range" min={0} max={100} step={1} 
              value={form.attendance} 
              onChange={e => setForm({ ...form, attendance: parseFloat(e.target.value) })} 
              style={{ width: '100%', accentColor: '#2563eb' }} 
            />
            <div className="flex justify-between"><span className="input-hint">0%</span><span className="input-hint">100%</span></div>
          </div>
          <div className="form-group">
            <label>Midterm Score: <strong>{form.midterm_score}/100</strong></label>
            <input 
              type="range" min={0} max={100} step={1} 
              value={form.midterm_score} 
              onChange={e => setForm({ ...form, midterm_score: parseFloat(e.target.value) })} 
              style={{ width: '100%', accentColor: '#2563eb' }} 
            />
            <div className="flex justify-between"><span className="input-hint">0</span><span className="input-hint">100</span></div>
          </div>
          <div className="form-group">
            <label>Assignment Average: <strong>{form.assignment_avg}/100</strong></label>
            <input 
              type="range" min={0} max={100} step={1} 
              value={form.assignment_avg} 
              onChange={e => setForm({ ...form, assignment_avg: parseFloat(e.target.value) })} 
              style={{ width: '100%', accentColor: '#2563eb' }} 
            />
            <div className="flex justify-between"><span className="input-hint">0</span><span className="input-hint">100</span></div>
          </div>
          <div className="form-group">
            <label>Previous GPA: <strong>{form.previous_gpa.toFixed(1)}/4.0</strong></label>
            <input 
              type="range" min={0} max={4} step={0.1} 
              value={form.previous_gpa} 
              onChange={e => setForm({ ...form, previous_gpa: parseFloat(e.target.value) })} 
              style={{ width: '100%', accentColor: '#2563eb' }} 
            />
            <div className="flex justify-between"><span className="input-hint">0</span><span className="input-hint">4.0</span></div>
          </div>

          <button className="btn btn-primary" onClick={handlePredict} disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8 }}>
            {loading ? 'Running...' : 'Run Prediction'}
          </button>

          {result ? (
            <div style={{ marginTop: 20, padding: 20, border: `2px solid ${resultBorderColor}`, borderRadius: 8, background: resultBgColor, textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>Prediction Result</div>
              <div style={{ fontSize: 42, fontWeight: 'bold', color: resultTextColor }}>
                {result.predicted_result.toUpperCase()}
              </div>
              {form.student_name ? <div style={{ fontSize: 14, color: '#555', margin: '6px 0' }}>{form.student_name}</div> : null}
              <div style={{ marginTop: 12 }}>
                <div className="flex justify-between" style={{ fontSize: 13, marginBottom: 4 }}>
                  <span>Confidence</span><span style={{ fontWeight: 'bold' }}>{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div style={{ background: '#e5e7eb', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${result.confidence * 100}%`, height: '100%', background: passProgressColor, borderRadius: 4 }} />
                </div>
                <div className="flex justify-between" style={{ fontSize: 12, marginTop: 6 }}>
                  <span style={{ color: '#dc2626' }}>Fail: {(result.probability_fail * 100).toFixed(1)}%</span>
                  <span style={{ color: '#16a34a' }}>Pass: {(result.probability_pass * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div>
          <div className="card mb-16">
            <div className="section-title">Model Status</div>
            <p style={{ fontSize: 14, fontWeight: 'bold', color: modelInfo && modelInfo.trained ? '#16a34a' : '#dc2626', marginBottom: 16 }}>
              {modelInfo ? (modelInfo.trained ? 'Model is trained and ready' : 'Model not trained') : 'Loading...'}
            </p>

            {sortedFeatures.length > 0 ? (
              <div>
                <div className="section-title">Which factors matter most?</div>
                {sortedFeatures.map((item) => {
                  const feat = item[0];
                  const imp = item[1];
                  return (
                    <div key={feat} style={{ marginBottom: 10 }}>
                      <div className="flex justify-between" style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: 13 }}>{featureLabels[feat]}</span>
                        <span style={{ fontSize: 12, fontWeight: 'bold' }}>{(imp * 100).toFixed(1)}%</span>
                      </div>
                      <div style={{ background: '#e5e7eb', borderRadius: 4, height: 7, overflow: 'hidden' }}>
                        <div style={{ width: `${imp * 100}%`, height: '100%', background: '#2563eb', borderRadius: 4 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="card mb-16">
            <div className="section-title">Retrain the Model</div>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 14 }}>
              Click below to retrain the model using all current student data in the database.
            </p>
            <button className="btn btn-ghost" onClick={handleTrain} disabled={training} style={{ width: '100%', justifyContent: 'center' }}>
              {training ? 'Training...' : 'Retrain Model'}
            </button>
            {trainMsg ? (
              <p style={{ marginTop: 10, fontSize: 13, padding: '8px 12px', borderRadius: 6, color: trainMsgColor, background: trainMsgBg }}>
                {trainMsg}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}