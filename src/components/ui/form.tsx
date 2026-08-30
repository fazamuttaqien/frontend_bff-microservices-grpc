import * as React from 'react'
import { cn } from '@/lib/utils'

function Form({ className, ...props }: React.ComponentProps<'form'>) { return <form data-slot="form" className={cn('space-y-4', className)} {...props} /> }
function FormItem({ className, ...props }: React.ComponentProps<'div'>) { return <div data-slot="form-item" className={cn('grid gap-2', className)} {...props} /> }
function FormLabel({ className, ...props }: React.ComponentProps<'label'>) { return <label data-slot="form-label" className={cn('text-sm font-medium', className)} {...props} /> }
function FormMessage({ className, ...props }: React.ComponentProps<'p'>) { return <p data-slot="form-message" className={cn('text-destructive text-sm', className)} {...props} /> }
export { Form, FormItem, FormLabel, FormMessage }
