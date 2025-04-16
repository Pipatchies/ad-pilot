/* eslint-disable react/display-name */
import React from "react";
import { cn } from "@/lib/utils"; // Utilisation de ton utilitaire cn pour les classes
import Link from "next/link";

// Typage commun pour tous les éléments
type CommonTypographyProps = {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
};

// Typage spécial pour les liens
type LinkTypographyProps = CommonTypographyProps & {
  variant: "a";
  href: string; // `href` est obligatoire si variant est "a"
};

// Typage pour les autres éléments
type NonLinkTypographyProps = CommonTypographyProps & {
  variant:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "span"
    | "p"
    | "blockquote"
    | "ul"
    | "table"
    | "thead"
    | "tbody"
    | "tr"
    | "th"
    | "td";
};

// Union des deux types
type TypographyProps = LinkTypographyProps | NonLinkTypographyProps;

// Mapping des classes pour chaque variante
const variantClasses = {
  h1: "text-9xl font-bold mb-8 tracking-[3px] font-mont",
  h2: "text-8xl font-bold mb-8 tracking-[3px] font-mont",
  h3: "text-5xl font-bold mb-8 tracking-[3px] font-mont",
  h4: "text-4xl font-bold mb-8 tracking-[3px] font-mont",
  h5: "text-lg font-mont",
  h6: "text-base font-mont",
  p: "lg:text-pretty",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  ul: "ml-6 w-full xl:w-auto list-disc text-sm",
  table: "w-full",
  thead: "text-left font-bold",
  tbody: "",
  tr: "m-0 border-t p-0 even:bg-muted",
  th: "border px-4 py-2 [&[align=center]]:text-center [&[align=right]]:text-right",
  td: "border px-4 py-2 [&[align=center]]:text-center [&[align=right]]:text-right",
  a: "text-primary underline",
  span: "",
};

// Le composant `Typography`
const Typography: React.FC<TypographyProps> = React.memo(
  ({ variant, children, className, ...props }: TypographyProps) => {
    const Component = variant;

    // Calcul des classes via `cn` (qui combine `clsx` et `tailwind-merge`)
    const computedClassName = cn(variantClasses[variant], className);

    // Cas particulier pour les liens
    if (variant === "a") {
      const { href } = props as LinkTypographyProps;
      return (
        <Link href={href} className={computedClassName}>
          {children}
        </Link>
      );
    }

    // Comportement par défaut pour les autres variantes
    return (
      <Component className={computedClassName} {...props}>
        {children}
      </Component>
    );
  }
);

export default Typography;