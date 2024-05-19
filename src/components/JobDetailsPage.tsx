import { formatMoney, relativeDate } from "@/lib/utils";
import { Job } from "@prisma/client";
import { Banknote, Briefcase, Clock, Globe2, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Markdown from "./Markdown";
import { Button } from "./ui/button";

interface JobDetailsPageProps {
  job: Job;
  applicationLink?: string;
}
const JobDetailsPage = ({
  job: {
    title,
    description,
    companyName,
    applicationUrl,
    type,
    locationType,
    location,
    salary,
    companyLogoUrl,
  },
  applicationLink,
}: JobDetailsPageProps) => {
  return (
    <section className="w-full grow space-y-5">
      <div className="flex items-center gap-3">
        {companyLogoUrl && (
          <Image
            src={companyLogoUrl}
            alt="Company Logo"
            width={60}
            height={60}
            className="rounded-xl"
          />
        )}

        <div className="w-full">
          <div className="w-full">
            <div className="flex  justify-between">
              <h1 className="text-xl font-bold">{title}</h1>
              <Button asChild>
                <a
                  href={applicationLink}
                  className="hidden w-40 md:block md:w-fit"
                >
                  Apply now
                </a>
              </Button>
            </div>

            <p className=" font-semibold">
              {applicationUrl ? (
                <Link
                  href={new URL(applicationUrl).origin}
                  className=" text-green-500 hover:underline"
                >
                  {companyName}
                </Link>
              ) : (
                <span>{companyName}</span>
              )}
            </p>
          </div>

          <div className="text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <Briefcase size={16} className="shrink-0" />
              {type}
            </p>
            <p className="flex items-center gap-1.5 ">
              <MapPin size={16} className="shrink-0" />
              {locationType}
            </p>
            <p className="flex items-center gap-1.5 ">
              <Globe2 size={16} className="shrink-0" />
              {location || "Worldwide"}
            </p>
            <p className="flex items-center gap-1.5 ">
              <Banknote size={16} className="shrink-0" />
              {formatMoney(salary)}
            </p>
          </div>
        </div>
      </div>
      <div>{description && <Markdown>{description}</Markdown>}</div>
    </section>
  );
};

export default JobDetailsPage;
