import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
}

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error(error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <main role="alert">
        <h1>Something went wrong</h1>
        <p>We couldn't display this page. Please reload and try again.</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </main>
    )
  }
}
