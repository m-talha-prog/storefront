import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Something went wrong displaying this content.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {this.state.error?.message}
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Try again
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}