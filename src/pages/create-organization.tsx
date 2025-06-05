import { checkAuth } from '@/lib/middleware/checkAuth.middleware'
import React from 'react'

export default function CreateOrganizationPage() {
  return (
    <div>create-organization</div>
  )
}

export const getServerSideProps = checkAuth();

