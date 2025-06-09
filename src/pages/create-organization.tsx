import CreateOrganization from '@/components/organization/CreateOrganization';
import { checkAuthSSR } from '@/lib/middleware/checkAuth.middleware'
import React from 'react'

export default function CreateOrganizationPage() {
  return (
    <CreateOrganization />
  )
}

export const getServerSideProps = checkAuthSSR();

