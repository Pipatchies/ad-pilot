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
};

const CtaButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ props, className, variant, userType, icon, ...rest }, ref) => {
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
      case "submit":
        if (!props?.text) return null;

        return (
          <Button
            ref={ref}
            type="submit"
            onClick={props?.onClick}
            variant="ghost"
            className={cn(
              "group flex items-center gap-2 p-5 rounded-sm text-base font-semibold transition border hover:border-primary hover:text-primary bg-primary text-white cursor-pointer",
              className
            )}
          >
            <span className="block !leading-none relative font-[600]">
              {text}
            </span>
          </Button>
        );

      case "cancel":
        if (!props?.text) return null;

        return (
          <Button
            ref={ref}
            type="button"
            variant="outline"
            className={cn(
              "group flex items-center gap-2 p-5 rounded-sm text-base font-semibold transition border hover:border-primary hover:text-primary bg-primary text-white cursor-pointer",
              className
            )}
          >
            <span className="block !leading-none relative font-[600]">
              {text}
            </span>
          </Button>
        );

      case "noIcon":
        if (!props?.url || !props?.text) return null;

        return (
          <Button
            ref={ref}
            variant="ghost"
            asChild
            className={cn(
              "group flex items-center gap-2 p-5 rounded-sm text-base font-semibold transition border hover:border-primary hover:text-primary bg-primary text-white",
              className
            )}
          >
            <Link {...linkProps}>
              <span className="block !leading-none font-600">{text}</span>
            </Link>
          </Button>
        );

      case "trigger":
        if (!props?.text) return null;

        return (
          <Button
            ref={ref}
            type="button"
            variant="ghost"
            className={cn(
              "group flex items-center gap-2 p-5 rounded-sm text-base font-semibold transition border border-primary text-primary hover:bg-primary hover:text-white",
              className
            )}
            {...props}
            {...rest}
          >
            {icon && <div className="mr-2">{icon}</div>}
            <span className="block !leading-none font-600">{text}</span>
          </Button>
        );

      default:
        if (!props?.url || !props?.text) return null;

        return (
          <Button
            ref={ref}
            variant="ghost"
            asChild
            className={cn(
              "group flex items-center gap-2 p-5 rounded-sm text-base font-semibold transition border border-primary text-primary hover:bg-primary hover:text-white",
              className
            )}
          >
            <Link {...linkProps}>
              {icon && <div className="mr-2">{icon}</div>}
              <span className="block !leading-none font-600">{text}</span>
            </Link>
          </Button>
        );
    }
  }
);
CtaButton.displayName = "CtaButton";

export default CtaButton;
