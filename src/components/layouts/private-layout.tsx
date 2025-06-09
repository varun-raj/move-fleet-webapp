import { queryClient } from '@/config/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen" >
        <div className="flex flex-col flex-1">
          <div className="flex flex-col flex-1">
            {children}
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}
