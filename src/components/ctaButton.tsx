"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
    props: string | any;
    className?: string;
    variant?: string;
    userType?: string;
    icon?: React.ReactNode;
}

export default function CtaButton({ props, className, variant, userType, icon }: Props) {

  const linkProps: any = {
    href: props.url,
    className: "flex items-center justify-between w-fit space-x-5",
  };

  if (props.target && props.target !== "self") {
    linkProps.target = props.target;
  }

  const text =
    userType === "client"
      ? props.text
      : props?.alt_text
      ? props.alt_text
      : props.text;

  switch (variant) {
    case "openModal":
      if (!props?.text) return null;

      return (
        <Button
          variant="ghost"
          className={cn(
            "group flex items-center gap-2 p-5 rounded-sm text-base font-semibold transition border border-primary text-primary hover:bg-primary hover:text-white",
            className
          )}
        >
          <div className="flex items-center justify-between w-fit space-x-5">
          {icon && <div className="mr-2">{icon}</div>}
            <span className="block !leading-none relative top-[3px] font-[600]">
              {text}
            </span>
          </div>
        </Button>
      );

      case "noIcon":
      if (!props?.url || !props?.text) return null;

      return (
        <Button
          variant="ghost"
          asChild
          className={cn(
            "group flex items-center gap-2 p-5 rounded-sm text-base font-semibold transition border hover:border-primary hover:text-primary bg-primary text-white",
            className
          )}
        >
          <Link {...linkProps}>
            <span className="block !leading-none font-600">
              {text}
            </span>
          </Link>
        </Button>
      );

    default:
      if (!props?.url || !props?.text) return null;

      return (
        <Button
          variant="ghost"
          asChild
          className={cn(
            "group flex items-center gap-2 p-5 rounded-sm text-base font-semibold transition border border-primary text-primary hover:bg-primary hover:text-white",
            className
          )}
        >
          <Link {...linkProps}>
          {icon && <div className="mr-2">{icon}</div>}
            <span className="block !leading-none font-600">
              {text}
            </span>
          </Link>
        </Button>
      );
  }
}