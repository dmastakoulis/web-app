import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (username === '') {
      setError('Please enter username and password.');
      return;
    }
    if (password === '') {
      setError('Please enter username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        username: username,
        password: password
      };

      const res = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('auth', 'true');
        onLogin();
      } else {
        if (data.error) {
          setError(data.error);
        } else {
          setError('Invalid username or password.');
        }
      }
    } catch (e) {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      submit();
    }
  }

  let buttonText = 'Sign In';
  let buttonCursor = 'pointer';
  
  if (loading) {
    buttonText = 'Signing in...';
    buttonCursor = 'not-allowed';
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 40,
        width: 360,
      }}>
       <h1 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 28 }}>
          Login
        </h1>

        {error ? (
          <div style={{
            color: '#dc2626',
            fontSize: 13,
            marginBottom: 16,
            padding: '10px 14px',
            background: '#fee2e2',
            borderRadius: 6,
            border: '1px solid #fca5a5',
          }}>
            {error}
          </div>
        ) : null}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 'bold', color: '#444', marginBottom: 6 }}>
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter username"
            style={{
              width: '100%',
              padding: '9px 12px',
              border: '1px solid #ccc',
              borderRadius: 6,
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 'bold', color: '#444', marginBottom: 6 }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter password"
            style={{
              width: '100%',
              padding: '9px 12px',
              border: '1px solid #ccc',
              borderRadius: 6,
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '11px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 'bold',
            cursor: buttonCursor,
          }}
        >
          {buttonText}
        </button>

        <p style={{ fontSize: 12, color: '#888', textAlign: 'center', marginTop: 20 }}>
          AIN5301EN · 2025-2026
        </p>
      </div>
    </div>
  );
}