import * as React from 'react'
import { cn } from '@/lib/utils'

const variants = { default: 'bg-primary text-primary-foreground', secondary: 'bg-secondary text-secondary-foreground', destructive: 'bg-destructive text-white', outline: 'border bg-background text-foreground' } as const
function Badge({ className, variant = 'default', ...props }: React.ComponentProps<'span'> & { variant?: keyof typeof variants }) { return <span data-slot="badge" className={cn('inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap', variants[variant], className)} {...props} /> }
export { Badge }
