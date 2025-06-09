import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { slugify } from '@/lib/helpers/string.helper';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { createOrganization } from '@/lib/apiHandlers/organization.apiHandler';

const organizationTypes = [
  { label: 'Clearing Agency', value: 'clearing_agency' },
  { label: 'Transporter', value: 'transporter' },
  { label: 'Delivery Agency', value: 'delivery_agency' },
];

export default function CreateOrganization() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    organizationType: '',
  });
  const [autoGenerateSlug, setAutoGenerateSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // User will replace this with their actual submission logic
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    if (!formData.name || (!formData.slug && !autoGenerateSlug)) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);

    // Placeholder for user's integration logic
    return createOrganization({
      name: formData.name,
      slug: formData.slug || autoGenerateSlug,
      organizationType: formData.organizationType as "clearing_agency" | "transporter" | "delivery_agency",
    }).then((orgData) => {
      toast.success('Organization created successfully, redirecting to organization page...');
      if (orgData?.organizationType === "clearing_agency") {
        router.push(`/ca/${orgData?.slug}`);
      } else if (orgData?.organizationType === "transporter") {
        router.push(`/t/${orgData?.slug}`);
      } else if (orgData?.organizationType === "delivery_agency") {
        router.push(`/da/${orgData?.slug}`);
      }
    })
      .catch((err) => {
        toast.error(err.message);
        setSubmitting(false);
      });

    // User might want to clear fields or give other feedback here
  };


  useEffect(() => {
    setAutoGenerateSlug(slugify(formData.name || ""));
  }, [formData.name]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-foreground">Create New Organization</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Set up your organization to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName" className="text-sm font-medium text-foreground">
                Organization Name
              </Label>
              <Input
                id="orgName"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={submitting}
                className="w-full"
                placeholder="Enter your organization name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgSlug" className="text-sm font-medium text-foreground">
                Organization Slug
              </Label>
              <Input
                id="orgSlug"
                name="slug"
                type="text"
                value={formData.slug || autoGenerateSlug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                disabled={submitting}
                className="w-full"
                placeholder="organization-slug"
                title="Lowercase letters, numbers, and hyphens only (e.g., my-cool-company)"
              />
              <p className="text-xs text-muted-foreground">
                This will be part of the URL. Use lowercase letters, numbers, and hyphens.
              </p>
            </div>

            {/* Add Organziation Type Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="orgType" className="text-sm font-medium text-foreground">
                Organization Type
              </Label>
              <Select value={formData.organizationType} onValueChange={(value) => setFormData({ ...formData, organizationType: value })}  >
                <SelectTrigger>
                  <SelectValue placeholder="Select Organization Type" />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Creating...' : 'Create Organization'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
