import type { Metadata } from "next";
import type { ReactNode } from "react";

import styles from "@/components/legal/legal-document.module.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import {
  SMARTX_DEFAULT_SOCIAL_IMAGE,
  SMARTX_INDEXABLE_ROBOTS,
  SMARTX_OPEN_GRAPH_DEFAULTS,
  SMARTX_TWITTER_DEFAULTS,
} from "@/lib/site-metadata";

const title = "Terms of Service | SmartX";
const description =
  "Read the terms that govern access to and use of the SmartX mobile application, website, and related services.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/terms",
  },
  robots: SMARTX_INDEXABLE_ROBOTS,
  openGraph: {
    ...SMARTX_OPEN_GRAPH_DEFAULTS,
    title,
    description,
    url: "/terms",
    type: "website",
    images: [SMARTX_DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    ...SMARTX_TWITTER_DEFAULTS,
    title,
    description,
    images: [SMARTX_DEFAULT_SOCIAL_IMAGE],
  },
};

type LegalSectionProps = {
  children: ReactNode;
  number: string;
  title: string;
};

function LegalSection({ children, number, title }: LegalSectionProps) {
  return (
    <section className={styles.policySection}>
      <div className={styles.sectionHeading}>
        <span aria-hidden="true">{number}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#terms-content">
        Skip to terms of service
      </a>
      <SiteHeader />

      <main id="terms-content" className={styles.main}>
        <article className={styles.article}>
          <header className={styles.policyHeader}>
            <p className={styles.eyebrow}>Legal / Terms</p>
            <h1>Terms of Service</h1>
            <dl className={styles.policyDates}>
              <div>
                <dt>Effective date</dt>
                <dd>
                  <time dateTime="2026-08">August 2026</time>
                </dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>
                  <time dateTime="2026-08">August 2026</time>
                </dd>
              </div>
            </dl>
            <p className={styles.intro}>
              These Terms of Service (the &quot;Terms&quot;) are an agreement
              between you and Edgewater Tech Limited (&quot;SmartX,&quot;
              &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) governing your
              access to and use of the SmartX mobile application, website at{" "}
              <a href="https://smartx.io">smartx.io</a>, and related services
              (collectively, the &quot;Services&quot;).
            </p>
            <p className={styles.introFollowup}>
              Please read these Terms carefully. By accessing or using the
              Services, you agree to these Terms and our{" "}
              <a href="/privacy-policy">Privacy Policy</a>. If you do not agree,
              do not use the Services.
            </p>
          </header>

          <LegalSection number="01" title="Eligibility">
            <p>
              You must be at least 18 years old and legally capable of entering
              into a binding agreement to use the Services. If you use the
              Services on behalf of an organization, you represent that you have
              authority to bind that organization to these Terms.
            </p>
            <p>
              You may not use the Services if doing so would violate applicable
              law, if you are subject to applicable trade or economic sanctions,
              or if SmartX has previously suspended or terminated your access.
            </p>
          </LegalSection>

          <LegalSection number="02" title="Accounts and Authentication">
            <p>
              Certain parts of the Services require a SmartX account. SmartX uses
              Privy to provide account creation, authentication, and session
              management. Available login methods may include Sign in with Apple,
              Sign in with Google, or other methods that we make available.
            </p>
            <p>
              Your use of Privy, Apple, Google, or another authentication provider
              may also be subject to that provider&apos;s terms and policies.
              SmartX does not receive your Apple or Google password.
            </p>
            <p>You are responsible for:</p>
            <ul>
              <li>providing accurate information when creating or using an account;</li>
              <li>keeping your device, login methods, and account access secure;</li>
              <li>all activity that occurs through your account; and</li>
              <li>
                promptly contacting us at{" "}
                <a href="mailto:support@smartx.io">support@smartx.io</a> if you
                suspect unauthorized access.
              </li>
            </ul>
            <p>
              You may not sell, transfer, share, or allow another person to use
              your SmartX account. We may require you to verify your identity or
              reauthenticate before completing security-sensitive account actions.
            </p>
            <p>
              You may delete your SmartX account through{" "}
              <strong>Settings &gt; Account &gt; Delete Account</strong>. Account
              deletion and our handling of associated information are described
              in our <a href="/privacy-policy">Privacy Policy</a>.
            </p>
            <p>
              The current Services do not use login to create an embedded crypto
              wallet. SmartX will not ask you for a crypto private key or seed
              phrase.
            </p>
          </LegalSection>

          <LegalSection number="03" title="The Services">
            <p>
              The Services provide market discovery and informational features,
              which may include token and market information, public blockchain
              activity, public market commentary, wallet or trader labels,
              estimates, rankings, and related tools.
            </p>
            <p>
              SmartX may add, remove, modify, suspend, or discontinue any part of
              the Services. We do not guarantee that any feature, market, token,
              profile, ranking, or item of content will remain available.
            </p>
            <p>
              The Services do not currently execute trades, accept transaction
              instructions, provide deposits or withdrawals, hold user funds or
              digital assets, or provide payment or KYC services. If SmartX
              introduces additional services, supplemental terms or disclosures
              may apply.
            </p>
          </LegalSection>

          <LegalSection number="04" title="Informational Purposes Only">
            <p>
              The Services and all information made available through them are
              provided for general informational purposes only. SmartX does not
              provide financial, investment, trading, legal, tax, accounting, or
              other professional advice.
            </p>
            <p>
              Nothing in the Services is an offer, solicitation, recommendation,
              endorsement, or guarantee to buy, sell, or hold any token, digital
              asset, security, financial instrument, or other product. SmartX is
              not acting as your broker, dealer, exchange, custodian, investment
              adviser, or fiduciary.
            </p>
            <p>
              Digital assets and related markets can be volatile and involve
              substantial risk. You are solely responsible for conducting your
              own research, evaluating information, obtaining professional advice
              where appropriate, and making your own decisions. Do not rely on
              the Services as the sole basis for any financial or investment
              decision.
            </p>
          </LegalSection>

          <LegalSection number="05" title="Market Data, Rankings, and Estimates">
            <p>
              Information displayed through the Services may come from public
              blockchains, third-party data providers, public sources, or
              calculations made by SmartX. Market data, wallet labels, risk
              indicators, trader rankings, performance metrics, and other
              estimates may be delayed, incomplete, inaccurate, unavailable, or
              calculated using methodologies that change over time.
            </p>
            <p>
              A label, ranking, score, badge, signal, or risk indicator does not
              verify a person&apos;s identity, guarantee the accuracy of the
              underlying data, certify that a token or service is safe, or
              predict future performance. Past performance is not indicative of
              future results.
            </p>
            <p>
              We may correct, remove, recalculate, reorder, or change the
              methodology for any data, label, estimate, or ranking at any time.
              You may not manipulate, game, or artificially influence rankings,
              metrics, or other features of the Services.
            </p>
          </LegalSection>

          <LegalSection number="06" title="Third-Party Services and Links">
            <p>
              The Services rely on or may link to third-party services, including
              Privy, Apple, Google, market-data providers, blockchain networks,
              websites, explorers, applications, and social platforms. SmartX
              does not own or control these third parties and is not responsible
              for their content, availability, security, accuracy, or practices.
            </p>
            <p>
              Your use of a third-party service is governed by that third
              party&apos;s terms and policies. A link, integration, label, or
              reference does not mean that SmartX endorses or guarantees the
              third party.
            </p>
            <p>
              Public blockchain networks are not controlled by SmartX. Blockchain
              records may be permanent, publicly visible, delayed, reorganized,
              or affected by network congestion, outages, forks, protocol changes,
              or other events outside our control.
            </p>
          </LegalSection>

          <LegalSection number="07" title="Limited License and Intellectual Property">
            <p>
              Subject to these Terms, SmartX grants you a limited, personal,
              non-exclusive, non-transferable, non-sublicensable, and revocable
              license to access and use the Services for lawful, non-commercial
              purposes.
            </p>
            <p>
              The Services, including their software, design, text, graphics,
              logos, interfaces, features, selection, arrangement, and other
              content, are owned by SmartX or its licensors and are protected by
              intellectual-property laws. Except for the limited license above,
              no right, title, or interest in the Services is transferred to you.
            </p>
            <p>
              You may not copy, reproduce, distribute, sell, license, modify,
              create derivative works from, publicly display, or commercially
              exploit the Services or their content unless SmartX expressly
              permits it in writing or applicable law allows it.
            </p>
          </LegalSection>

          <LegalSection number="08" title="Prohibited Conduct">
            <p>You agree not to:</p>
            <ul>
              <li>
                use the Services for unlawful, fraudulent, deceptive, abusive, or
                harmful activity;
              </li>
              <li>access or attempt to access another person&apos;s account;</li>
              <li>
                impersonate another person or misrepresent your identity or
                affiliation;
              </li>
              <li>
                interfere with, disrupt, overload, damage, or compromise the
                Services or related systems;
              </li>
              <li>
                probe, scan, or test vulnerabilities or bypass authentication,
                access, rate, geographic, or security controls;
              </li>
              <li>
                introduce malware, viruses, harmful code, or other disruptive
                technology;
              </li>
              <li>
                reverse engineer, decompile, disassemble, or attempt to derive
                source code, except where applicable law expressly permits it;
              </li>
              <li>
                scrape, crawl, harvest, copy, or extract data from the Services
                through unauthorized automated or manual means;
              </li>
              <li>
                use bots or automation to create accounts or manipulate rankings,
                metrics, traffic, or product behavior;
              </li>
              <li>
                collect personal information about other users without
                authorization;
              </li>
              <li>remove or alter proprietary notices;</li>
              <li>
                use the Services or their data to build a competing product
                without our written permission; or
              </li>
              <li>
                encourage or assist another person in doing any of the above.
              </li>
            </ul>
            <p>
              We may investigate suspected violations and cooperate with
              law-enforcement authorities where appropriate.
            </p>
          </LegalSection>

          <LegalSection number="09" title="Feedback">
            <p>
              If you provide feedback, suggestions, or ideas about the Services,
              you grant SmartX a worldwide, perpetual, irrevocable, royalty-free
              right to use, reproduce, modify, distribute, and otherwise use that
              feedback for any lawful purpose without compensation or
              restriction. Do not provide feedback that you do not have the right
              to share.
            </p>
          </LegalSection>

          <LegalSection number="10" title="Privacy">
            <p>
              Our <a href="/privacy-policy">Privacy Policy</a> explains how we
              collect, use, and share information. By using the Services, you
              acknowledge the practices described in the Privacy Policy.
            </p>
          </LegalSection>

          <LegalSection number="11" title="Suspension and Termination">
            <p>
              You may stop using the Services at any time and may delete your
              account as described above.
            </p>
            <p>
              We may restrict, suspend, or terminate your account or access to the
              Services if we reasonably believe that you violated these Terms,
              created security or legal risk, used the Services fraudulently or
              unlawfully, or if suspension is required to protect SmartX, our
              users, or third parties. Where appropriate, we may provide notice or
              an opportunity to address the issue.
            </p>
            <p>
              Sections that by their nature should survive termination, including
              intellectual property, disclaimers, limitations of liability,
              indemnification, and dispute provisions, will remain in effect.
            </p>
          </LegalSection>

          <LegalSection number="12" title="Disclaimer of Warranties">
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, THE SERVICES ARE PROVIDED
              &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; SMARTX AND ITS
              AFFILIATES, LICENSORS, AND SERVICE PROVIDERS DISCLAIM ALL EXPRESS,
              IMPLIED, AND STATUTORY WARRANTIES, INCLUDING WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE,
              NON-INFRINGEMENT, ACCURACY, AVAILABILITY, AND SECURITY.
            </p>
            <p>
              WE DO NOT WARRANT THAT THE SERVICES OR ANY DATA, CONTENT, RANKING,
              ESTIMATE, OR THIRD-PARTY SERVICE WILL BE ACCURATE, COMPLETE, CURRENT,
              SECURE, UNINTERRUPTED, OR ERROR-FREE. SOME JURISDICTIONS DO NOT ALLOW
              CERTAIN WARRANTY DISCLAIMERS, SO PARTS OF THIS SECTION MAY NOT APPLY
              TO YOU.
            </p>
          </LegalSection>

          <LegalSection number="13" title="Limitation of Liability">
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, SMARTX AND ITS AFFILIATES,
              OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, LICENSORS, AND SERVICE
              PROVIDERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF
              PROFITS, REVENUE, DATA, GOODWILL, BUSINESS OPPORTUNITY, OR DIGITAL
              ASSETS, ARISING OUT OF OR RELATING TO THE SERVICES OR THESE TERMS,
              EVEN IF ADVISED THAT SUCH DAMAGES WERE POSSIBLE.
            </p>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, THE TOTAL LIABILITY OF
              SMARTX AND THE PARTIES LISTED ABOVE FOR ALL CLAIMS ARISING OUT OF OR
              RELATING TO THE SERVICES OR THESE TERMS WILL NOT EXCEED THE GREATER
              OF (A) THE AMOUNT YOU PAID SMARTX TO USE THE SERVICES DURING THE
              TWELVE MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM OR (B) USD
              100.
            </p>
            <p>
              Nothing in these Terms excludes or limits liability that cannot
              lawfully be excluded or limited. Some jurisdictions do not allow
              certain limitations of liability, so parts of this section may not
              apply to you.
            </p>
          </LegalSection>

          <LegalSection number="14" title="Indemnification">
            <p>
              To the extent permitted by law, you agree to defend, indemnify, and
              hold harmless SmartX and its affiliates, officers, directors,
              employees, agents, licensors, and service providers from claims,
              liabilities, damages, losses, and expenses, including reasonable
              legal fees, arising from your violation of these Terms, misuse of
              the Services, infringement of another person&apos;s rights, or
              unlawful conduct.
            </p>
            <p>
              This section does not apply to the extent prohibited by applicable
              consumer law.
            </p>
          </LegalSection>

          <LegalSection number="15" title="Governing Law and Disputes">
            <p>
              These Terms are governed by the laws of <strong>Singapore</strong>,
              without regard to conflict-of-law rules. Subject to any rights you
              have under mandatory consumer law, the courts of Singapore will
              have exclusive jurisdiction over disputes arising out of or relating
              to these Terms or the Services.
            </p>
            <p>
              Before filing a formal claim, you and SmartX agree to try to resolve
              the dispute informally. A party must send written notice describing
              the dispute and requested resolution. If the dispute is not resolved
              within 30 days after receipt of the notice, either party may pursue
              available legal remedies.
            </p>
          </LegalSection>

          <LegalSection number="16" title="Changes to These Terms">
            <p>
              We may update these Terms as the Services or legal requirements
              change. The updated Terms will identify a new &quot;Last
              Updated&quot; date. If a change is material, we will provide
              appropriate notice through the Services, website, email, or another
              suitable channel.
            </p>
            <p>
              Your continued use of the Services after updated Terms take effect
              constitutes acceptance of the updated Terms, except where applicable
              law requires another form of consent.
            </p>
          </LegalSection>

          <LegalSection number="17" title="Miscellaneous">
            <p>
              These Terms and the Privacy Policy constitute the entire agreement
              between you and SmartX regarding the Services, except for any
              supplemental terms that expressly apply to a feature.
            </p>
            <p>
              If any provision of these Terms is found unenforceable, it will be
              limited or removed to the minimum extent necessary, and the
              remaining provisions will remain effective. SmartX&apos;s failure
              to enforce a provision is not a waiver. You may not assign these
              Terms without our written consent. SmartX may assign these Terms as
              part of a merger, acquisition, reorganization, or sale of assets.
            </p>
          </LegalSection>

          <LegalSection number="18" title="Contact Us">
            <p>Questions, feedback, and support requests should be sent to:</p>
            <address className={styles.contactDetails}>
              <div>
                <span>Email</span>
                <a href="mailto:support@smartx.io">support@smartx.io</a>
              </div>
              <div>
                <span>Website</span>
                <a href="https://smartx.io">smartx.io</a>
              </div>
            </address>
          </LegalSection>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
