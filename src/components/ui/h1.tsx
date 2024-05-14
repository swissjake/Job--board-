import { cn } from "@/lib/utils";
import React from "react";

const H1 = (props: React.HTMLProps<HTMLHeadingElement>) => {
  return (
    <h1
      className={cn(
        "lg-text-5xl text-4xl font-extrabold tracking-tight",
        props.className,
      )}
      {...props}
    />
  );
};

export default H1;
