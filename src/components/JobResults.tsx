import prisma from "@/lib/prisma";
import React from "react";
import JobListItem from "./JobListItem";
import { JobFilterValues } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
interface JobResultsProps {
  filterValues: JobFilterValues;
  page?: number;
}
const JobResults = async ({ filterValues, page = 1 }: JobResultsProps) => {
  const { q, type, location, remote } = filterValues;

  const jobsPerPage = 6;
  const skip = (page - 1) * jobsPerPage;
  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  const searchFilter: Prisma.JobWhereInput = searchString
    ? {
        OR: [
          { title: { search: searchString } },
          { companyName: { search: searchString } },
          { type: { search: searchString } },
          { locationType: { search: searchString } },
          { location: { search: searchString } },
        ],
      }
    : {};

  const where: Prisma.JobWhereInput = {
    AND: [
      searchFilter,
      type ? { type } : {},
      location ? { location } : {},
      remote ? { locationType: "Remote" } : {},
      location ? { location } : {},
      { approved: true },
    ],
  };
  const jobsPromise = prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: jobsPerPage,
    skip,
  });

  const countPromise = prisma.job.count({ where });
  const [jobs, totalResults] = await Promise.all([jobsPromise, countPromise]);
  return (
    <div className="grow space-y-4">
      {jobs.map((job) => (
        <Link href={`/jobs/${job.slug}`} key={job.id} className="block">
          <JobListItem job={job} />
        </Link>
      ))}
      {jobs.length === 0 && (
        <p className="m-auto text-center">
          No jobs found. Try adjusting your search filters
        </p>
      )}

      {jobs.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalResults / jobsPerPage)}
          filterValues={filterValues}
        />
      )}
    </div>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  filterValues: JobFilterValues;
}

function Pagination({
  currentPage,
  totalPages,
  filterValues: { q, type, location, remote },
}: PaginationProps) {
  function generatePageLink(page: number) {
    const searchParams = new URLSearchParams({
      ...(q && { q: q.trim() }),
      ...(type && { type }),
      ...(remote && { remote: "true" }),
      ...(location && { location }),
      page: page.toString(),
    });

    return `/?${searchParams.toString()}`;
  }

  return (
    <div className="flex justify-between">
      <Link
        href={generatePageLink(currentPage - 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage <= 1 && "invisible",
        )}
      >
        <ArrowLeft size={16} />
        Previous page
      </Link>
      <span className=" font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={generatePageLink(currentPage + 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage >= totalPages && "invisible",
        )}
      >
        <ArrowRight size={16} />
        Next page
      </Link>
    </div>
  );
}

export default JobResults;
