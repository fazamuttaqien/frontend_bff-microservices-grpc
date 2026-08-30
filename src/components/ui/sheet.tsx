import * as React from 'react'
import { cn } from '@/lib/utils'

function Sheet({ className, ...props }: React.ComponentProps<'div'>) { return <div data-slot="sheet" className={cn('fixed inset-0 z-50 bg-background', className)} {...props} /> }
function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) { return <div data-slot="sheet-header" className={cn('flex flex-col gap-2 p-4', className)} {...props} /> }
function SheetTitle({ className, ...props }: React.ComponentProps<'h2'>) { return <h2 data-slot="sheet-title" className={cn('text-lg font-semibold', className)} {...props} /> }
export { Sheet, SheetHeader, SheetTitle }
