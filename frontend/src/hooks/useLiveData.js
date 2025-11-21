import React, { useState, useEffect } from 'react'

// Custom hook for real-time data updates
export function useLiveData(url, interval = 5000) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result)
        setError(null)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }

    // Fetch immediately
    fetchData()

    // Set up interval for updates
    const intervalId = setInterval(fetchData, interval)

    return () => clearInterval(intervalId)
  }, [url, interval])

  return { data, loading, error }
}

// WebSocket hook for real-time updates
export function useWebSocket(url) {
  const [data, setData] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const ws = new WebSocket(url)

    ws.onopen = () => {
      console.log('WebSocket connected')
      setConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        setData(message)
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setConnected(false)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setConnected(false)
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [url])

  return { data, connected }
}

// Server-Sent Events (SSE) hook for one-way real-time updates
export function useSSE(url) {
  const [data, setData] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const eventSource = new EventSource(url)

    eventSource.onopen = () => {
      console.log('SSE connected')
      setConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        setData(message)
      } catch (error) {
        console.error('Failed to parse SSE message:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      setConnected(false)
    }

    return () => {
      eventSource.close()
    }
  }, [url])

  return { data, connected }
}

// Socket.IO hook for real-time bi-directional updates
export function useSocketIO(url, eventName) {
  const [data, setData] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.socket.io/4.5.4/socket.io.min.js'
    document.head.appendChild(script)

    script.onload = () => {
      const io = window.io
      const socket = io(url)

      socket.on('connect', () => {
        console.log('Socket.IO connected')
        setConnected(true)
      })

      socket.on(eventName, (message) => {
        setData(message)
      })

      socket.on('disconnect', () => {
        console.log('Socket.IO disconnected')
        setConnected(false)
      })

      return () => {
        socket.disconnect()
      }
    }
  }, [url, eventName])

  return { data, connected }
}

// React Query alternative (for advanced caching and synchronization)
export function useQueryData(url, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFetching, setIsFetching] = useState(false)

  const {
    refetchInterval = 5000,
    staleTime = 10000,
    enabled = true,
    onSuccess = null,
    onError = null,
  } = options

  useEffect(() => {
    if (!enabled) return

    const fetchData = async () => {
      try {
        setIsFetching(true)
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result)
        setError(null)
        if (onSuccess) onSuccess(result)
      } catch (err) {
        setError(err.message)
        if (onError) onError(err)
      } finally {
        setIsFetching(false)
        setLoading(false)
      }
    }

    fetchData()

    const intervalId = setInterval(fetchData, refetchInterval)

    return () => clearInterval(intervalId)
  }, [url, refetchInterval, enabled, onSuccess, onError])

  const refetch = async () => {
    setLoading(true)
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, isFetching, refetch }
}

export default {
  useLiveData,
  useWebSocket,
  useSSE,
  useSocketIO,
  useQueryData,
}
