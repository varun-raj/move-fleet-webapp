import ListOrganization from '@/components/organization/ListOrganization'
import { checkAuthSSR } from '@/lib/middleware/checkAuth.middleware'
import React from 'react'

export default function IndexPage() {
  return (
    <ListOrganization />
  )
}

export const getServerSideProps = checkAuthSSR()