"use server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type formState = { error?: string } | undefined;

export async function approveSubmission(
  prevState: formState,
  formData: FormData,
): Promise<formState> {
  try {
    const jobId = parseInt(formData.get("jobId") as string);

    const user = await currentUser();
    if (!user || !isAdmin(user)) {
      throw new Error("Not authorized");
    }
    await prisma.job.update({ where: { id: jobId }, data: { approved: true } });
    revalidatePath("/");
  } catch (error) {
    let message = "Unexpected error";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
}

export async function deleteJob(prevState: formState, formData: FormData) {
  try {
    const jobId = parseInt(formData.get("jobId") as string);

    const user = await currentUser();
    if (!user || !isAdmin(user)) {
      throw new Error("Not authorized");
    }
    await prisma.job.delete({ where: { id: jobId } });
    revalidatePath("/");
  } catch (error) {
    let message = "Unexpected error";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }

  redirect("/admin");
}
