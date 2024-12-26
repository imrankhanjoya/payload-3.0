'use client'
// pages/force-login.tsx
import { useState } from 'react'
import axios from 'axios'

const Page = () => {
  const [email, setEmail] = useState('dev@payloadcms.com')
  const [response, setResponse] = useState<{
    token?: string
    email?: string
    id?: string
    error?: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setResponse(null)

    try {
      // const res = await axios.post('/api/force-login', { email })

      const res = fetch('/api/force-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'dev@payloadcms.com' }),
      })
        .then((response) => response.json())
        .then((data) => console.log('B1', data))
        .catch((error) => console.error(error))

      setResponse(res.data)
    } catch (error: any) {
      setResponse({
        error: error.response?.data?.error || 'An unexpected error occurred.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Force Login</h1>
      <label style={{ display: 'block', marginBottom: '10px' }}>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user's email"
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
        />
      </label>
      <button
        onClick={handleLogin}
        disabled={loading || !email}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        {loading ? 'Processing...' : 'Force Login'}
      </button>
      {response && (
        <div
          style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}
        >
          {response.error && <p style={{ color: 'red' }}>{response.error}</p>}
          {response.token && (
            <div>
              <p>
                <strong>Token:</strong> {response.token}
              </p>
              <p>
                <strong>Email:</strong> {response.email}
              </p>
              <p>
                <strong>ID:</strong> {response.id}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Page
