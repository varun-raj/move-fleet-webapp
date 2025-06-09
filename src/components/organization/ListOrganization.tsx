import { Organization } from '@/db/schema';
import { listOrganizations } from '@/lib/apiHandlers/organization.apiHandler';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

const organizationTypeToPath = (organizationType: string) => {
  if (organizationType === 'clearing_agency') return 'ca';
  if (organizationType === 'transporter') return 't';
  if (organizationType === 'delivery_agency') return 'da';
  return '';
}

export default function ListOrganization() {
  const { data, isLoading } = useQuery<Organization[]>({
    queryKey: ['organizations'],
    queryFn: () => listOrganizations(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No organizations found
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-7xl w-full flex flex-col gap-4'>
      <h3 className='text-2xl font-bold'>Your Organizations</h3>
      <div className="space-y-4">
        {data.map((organization) => (
          <div key={organization.id}>
            <Link
              href={`/${organizationTypeToPath(organization.organizationType)}/${organization.slug}`}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors flex flex-col gap-2"
            >
              <h3 className="font-medium text-gray-900">{organization.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {organization.organizationType} - {organization.slug}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
