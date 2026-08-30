import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

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
      <main className="mx-auto flex min-h-[50vh] w-full max-w-lg items-center px-4 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>We couldn&apos;t display this page</AlertTitle>
              <AlertDescription>
                Please reload the page and try again. If the problem continues,
                return later.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button type="button" onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </CardFooter>
        </Card>
      </main>
    )
  }
}
