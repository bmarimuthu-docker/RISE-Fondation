import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)

  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      handleVerification(token)
    }
  }, [token])

  const handleVerification = async (verificationToken) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Verification failed')
        return
      }

      setVerified(true)
      setMessage('Email verified successfully! Redirecting to login...')

      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError('Error verifying email: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    const email = localStorage.getItem('email')
    if (!email) {
      setError('Email not found. Please sign up again.')
      return
    }

    setLoading(true)
    setMessage('')
    setError('')

    try {
      // Backend would have an endpoint to resend verification email
      setMessage('Verification email sent! Check your inbox.')
    } catch (err) {
      setError('Error resending email: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center">
        {verified ? (
          <>
            <CheckCircle className="mx-auto mb-4 text-green-600" size={64} />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verified!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
          </>
        ) : (
          <>
            <Mail className="mx-auto mb-4 text-blue-600" size={64} />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600 mb-6">
              Click the link in your email to verify your account. If you don't see it, check your spam folder.
            </p>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <p className="text-red-700 text-sm text-left">{error}</p>
              </div>
            )}

            {message && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            )}

            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {loading && <Loader className="animate-spin" size={20} />}
              Resend Verification Email
            </button>
          </>
        )}
      </div>
    </div>
  )
}
