import { forwardRef, type AnchorHTMLAttributes } from "react";

type JoinWaitlistCtaProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children" | "href" | "target" | "rel"
> & {
  labelClassName?: string;
};

/**
 * Internal campaign CTA. Placement-specific classes continue to own scale and
 * animation so the frozen homepage composition does not change.
 */
export const JoinWaitlistCta = forwardRef<
  HTMLAnchorElement,
  JoinWaitlistCtaProps
>(function JoinWaitlistCta(
  { className, labelClassName, ...props },
  ref,
) {
  return (
    <a {...props} ref={ref} className={className} href="/waitlist/">
      <span className={labelClassName}>
        <b>Join Waitlist</b>
        <b aria-hidden="true">Join Waitlist</b>
      </span>
      <i aria-hidden="true">→</i>
    </a>
  );
});
