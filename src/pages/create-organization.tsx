import CreateOrganization from '@/components/organization/CreateOrganization';
import { checkAuth } from '@/lib/middleware/checkAuth.middleware'
import React from 'react'

export default function CreateOrganizationPage() {
  return (
    <CreateOrganization />
  )
}

export const getServerSideProps = checkAuth();

