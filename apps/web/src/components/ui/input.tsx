import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full pl-12 pr-4 py-4 input-glass focus:border-primary ring-2 ring-primary/20 focus:ring-2 focus:ring-primary/50 rounded-full transition-all outline-none text-slate-900  placeholder:text-slate-500',
        className
      )}
      {...props}
    />
  )
}

export { Input }
