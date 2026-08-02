import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#060b14',
            color: '#b8e8ff',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h1 style={{ color: '#3de8ff', marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ opacity: 0.8, marginBottom: '1rem' }}>
            The portfolio hit a runtime error. Try a hard refresh (Ctrl+Shift+R).
          </p>
          <pre
            style={{
              background: '#0a1224',
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '12px',
              color: '#ff8fa3',
            }}
          >
            {String(this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
