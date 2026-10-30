import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex items-center justify-center py-16">
          <div className="card max-w-md w-full text-center space-y-4">
            <AlertTriangle className="h-10 w-10 text-red-500 mx-auto" aria-hidden />
            <h2 className="text-lg font-semibold text-slate-800">Something went wrong</h2>
            <p className="text-sm text-slate-500">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <button onClick={this.handleReset} className="btn-secondary mx-auto">
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
