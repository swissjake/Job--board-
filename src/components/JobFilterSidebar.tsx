import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Select from "./ui/select";
import prisma from "@/lib/prisma";
import { jobTypes } from "@/lib/job-types";
import { Checkbox } from "./ui/checkbox";
import { JobFilterSchema, JobFilterValues } from "@/lib/validation";
import { redirect } from "next/navigation";
import FormSubmitButton from "./FormSubmitButton";

async function filterJobs(formData: FormData) {
  "use server";

  const values = Object.fromEntries(formData.entries());
  const { q, location, type, remote } = JobFilterSchema.parse(values);

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(remote && { remote: "true" }),
    ...(location && { location }),
  });

  redirect(`/?${searchParams.toString()}`);
}

interface JobFilterSidebarProps {
  defaultValues: JobFilterValues;
}

const JobFilterSidebar = async ({ defaultValues }: JobFilterSidebarProps) => {
  const distinctLocation = (await prisma.job
    .findMany({
      where: { approved: true },
      select: { location: true },
      distinct: ["location"],
    })
    .then((locations) =>
      locations.map(({ location }) => location).filter(Boolean),
    )) as string[];
  return (
    <aside className="sticky top-0 h-fit rounded-lg border bg-background p-3 md:w-[260px]">
      <form action={filterJobs} key={JSON.stringify(defaultValues)}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              placeholder="Title, Company, etc."
              defaultValue={defaultValues?.q}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select id="type" name="type" defaultValue={defaultValues.type}>
              <option value={""}>All Types</option>
              {jobTypes?.map((type: string) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select
              id="location"
              name="location"
              defaultValue={defaultValues.location}
            >
              <option value={""}>All locations</option>
              {distinctLocation?.map((location: string) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>

          <div className=" flex items-center gap-2">
            <Checkbox defaultChecked={defaultValues.remote} />
            <Label htmlFor="remote">Remote jobs</Label>
          </div>
          <FormSubmitButton>Filter Jobs</FormSubmitButton>
        </div>
      </form>
    </aside>
  );
};

export default JobFilterSidebar;
