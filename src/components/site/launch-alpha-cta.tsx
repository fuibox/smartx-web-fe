import {
  forwardRef,
  type AnchorHTMLAttributes,
} from "react";

import {
  createSmartXAppHref,
  type SmartXAppContent,
} from "@/lib/smartx-links";

type LaunchAlphaCtaProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children" | "href" | "target" | "rel"
> & {
  source: SmartXAppContent;
  labelClassName?: string;
};

/**
 * Shared CTA structure and destination. Visual scale remains owned by each
 * placement so Hero, Closing and editorial chrome keep their signed-off size.
 */
export const LaunchAlphaCta = forwardRef<
  HTMLAnchorElement,
  LaunchAlphaCtaProps
>(function LaunchAlphaCta(
  { className, labelClassName, source, ...props },
  ref,
) {
  return (
    <a
      {...props}
      ref={ref}
      className={className}
      href={createSmartXAppHref(source)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={labelClassName}>
        <b>Launch Alpha</b>
        <b aria-hidden="true">Launch Alpha</b>
      </span>
      <i aria-hidden="true">↗</i>
    </a>
  );
});
