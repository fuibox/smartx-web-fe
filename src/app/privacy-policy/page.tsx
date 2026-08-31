import type { Metadata } from "next";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import {
  SMARTX_DEFAULT_SOCIAL_IMAGE,
  SMARTX_INDEXABLE_ROBOTS,
  SMARTX_OPEN_GRAPH_DEFAULTS,
  SMARTX_TWITTER_DEFAULTS,
} from "@/lib/site-metadata";

import styles from "@/components/legal/legal-document.module.css";

const title = "Privacy Policy | SmartX";
const description =
  "Learn how SmartX collects, uses, shares, retains, and protects information when you use its applications, website, and related services.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/privacy-policy",
  },
  robots: SMARTX_INDEXABLE_ROBOTS,
  openGraph: {
    ...SMARTX_OPEN_GRAPH_DEFAULTS,
    title,
    description,
    url: "/privacy-policy",
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

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#privacy-policy-content">
        Skip to privacy policy
      </a>
      <SiteHeader />

      <main id="privacy-policy-content" className={styles.main}>
        <article className={styles.article}>
          <header className={styles.policyHeader}>
            <p className={styles.eyebrow}>Legal / Privacy</p>
            <h1>Privacy Policy</h1>
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
              This Privacy Policy for Edgewater Tech Limited, a company
              incorporated in the British Virgin Islands (&quot;SmartX,&quot;
              &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), explains how we
              collect, use, and share information when you use the SmartX mobile
              application, website, and related services (collectively, the
              &quot;Services&quot;).
            </p>
          </header>

          <section className={styles.policySection}>
            <div className={styles.sectionHeading}>
              <span aria-hidden="true">01</span>
              <h2>Information We Collect</h2>
            </div>

            <h3>Information collected automatically</h3>
            <p>
              When you use the Services, we and our service providers may
              automatically collect limited technical and usage information,
              including:
            </p>
            <ul>
              <li>
                device type, operating system, browser type, app version, and
                language;
              </li>
              <li>
                IP address, network information, timestamps, and general region
                inferred from an IP address;
              </li>
              <li>
                pages, screens, markets, tokens, profiles, or other content
                viewed or searched for;
              </li>
              <li>
                interactions with features, links, filters, and navigation
                controls; and
              </li>
              <li>
                crash logs, performance information, error reports, and security
                events.
              </li>
            </ul>

            <h3>Account and login information</h3>
            <p>
              SmartX uses Privy to provide account creation, authentication, and
              session management. When you create or access a SmartX account, we
              may receive a Privy user ID, your login method, email address,
              account and session information, and the date and time of account
              activity.
            </p>
            <p>
              If you sign in with Apple or Google, we may also receive an
              identifier associated with that provider and basic profile
              information, such as your name, email address, or profile picture,
              depending on the information you choose to share and the
              provider&apos;s settings. SmartX does not receive your Apple or
              Google password.
            </p>
            <p>
              The current Services do not use login to create an embedded crypto
              wallet and do not ask for a crypto private key or seed phrase.
            </p>

            <h3>Information you provide</h3>
            <p>
              If you contact us, submit feedback, or request support, we may
              collect your contact information and the contents of your
              communication.
            </p>
            <p>
              Please do not send us private keys, seed phrases, passwords, or
              verification codes. SmartX will never ask you to provide a crypto
              private key or seed phrase through customer support.
            </p>

            <h3>Preferences</h3>
            <p>
              The Services may remember settings such as theme and language. When
              these preferences remain only on your device, they are not
              collected by SmartX. If you choose or use a feature that
              synchronizes preferences across devices, we may associate those
              preferences with your SmartX account.
            </p>

            <h3>Information from public and third-party sources</h3>
            <p>
              The Services display information obtained from public blockchains
              and third-party data providers. This may include blockchain
              addresses and transactions; token, contract, holder, price,
              volume, and liquidity data; public wallet labels and risk
              indicators; estimated trading or position metrics; public profile
              information; market commentary; and trader rankings.
            </p>
            <p>
              Public blockchain addresses and profiles may be considered
              personal data if they can be linked to an identifiable person.
              SmartX may organize, rank, or derive estimates from public and
              third-party information. These labels and estimates may be
              incomplete or inaccurate and should not be treated as identity
              verification, financial advice, or a guarantee of safety.
            </p>
            <p>
              The current Services do not ask users to provide KYC documents,
              payment card or bank account information, personal trading or
              transaction information, crypto private keys, seed phrases,
              precise location, contacts, photos, or microphone recordings.
            </p>
          </section>

          <section className={styles.policySection}>
            <div className={styles.sectionHeading}>
              <span aria-hidden="true">02</span>
              <h2>How We Use Information</h2>
            </div>
            <p>We may use information to:</p>
            <ul>
              <li>create and manage your SmartX account;</li>
              <li>
                authenticate you, maintain your session, and protect your
                account;
              </li>
              <li>provide, operate, maintain, and improve the Services;</li>
              <li>
                display, organize, search, and rank public market and blockchain
                information;
              </li>
              <li>monitor performance and diagnose errors;</li>
              <li>protect the security and integrity of the Services;</li>
              <li>
                detect and prevent fraud, abuse, attacks, and other harmful
                activity;
              </li>
              <li>respond to questions, feedback, and support requests;</li>
              <li>understand aggregate usage and improve the user experience;</li>
              <li>
                comply with legal obligations and enforce our Terms of Service;
                and
              </li>
              <li>
                protect the rights, property, and safety of SmartX, our users,
                and others.
              </li>
            </ul>
          </section>

          <section className={styles.policySection}>
            <div className={styles.sectionHeading}>
              <span aria-hidden="true">03</span>
              <h2>How We Share Information</h2>
            </div>

            <h3>Service providers</h3>
            <p>
              We may share information with service providers that help us
              operate the Services, such as providers of cloud hosting, content
              delivery, security, diagnostics, analytics, customer support, and
              market-data infrastructure. These providers may process
              information only as necessary to perform services for us and
              subject to applicable contractual and legal obligations.
            </p>
            <p>
              SmartX uses{" "}
              <a
                href="https://www.privy.io/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privy
              </a>{" "}
              (operated by Horkos, LLC) to provide account creation, login,
              session management, and related security services. Privy may
              process account identifiers, login information, device and IP
              information, and session and security data for these purposes.
            </p>
            <p>
              If you choose Sign in with Apple or Sign in with Google, Apple or
              Google will process information as described in their own privacy
              policies, and relevant account information will be provided to
              SmartX and Privy to complete authentication.
            </p>

            <h3>Legal and safety purposes</h3>
            <p>
              We may disclose information if required by law, legal process, or
              a valid governmental request, or when reasonably necessary to
              investigate fraud or security incidents, enforce our agreements,
              or protect the rights, property, or safety of SmartX, our users,
              or others.
            </p>

            <h3>Business transfers</h3>
            <p>
              If SmartX is involved in a merger, acquisition, financing,
              reorganization, bankruptcy, or sale of all or part of its business
              or assets, information may be transferred as part of that
              transaction, subject to applicable law.
            </p>

            <h3>No sale of personal data</h3>
            <p>
              SmartX does not sell personal data for money or share personal data
              for cross-context behavioral advertising. If this practice
              changes, we will update this Privacy Policy and provide any choices
              required by law before the change takes effect.
            </p>
          </section>

          <section className={styles.policySection}>
            <div className={styles.sectionHeading}>
              <span aria-hidden="true">04</span>
              <h2>Public Blockchain and Third-Party Data</h2>
            </div>
            <p>
              Public blockchains are distributed networks that SmartX does not
              control. Information recorded on a public blockchain may be
              publicly visible, permanent, and impossible for SmartX to change or
              delete.
            </p>
            <p>
              SmartX may correct or remove information maintained in its own
              systems where appropriate, but cannot erase or change public
              blockchain records or information independently maintained by a
              third party.
            </p>
            <p>
              The Services may contain links to third-party websites,
              applications, wallets, explorers, or social platforms. SmartX is
              not responsible for their privacy or security practices. Please
              review their policies before providing information to them.
            </p>
          </section>

          <section className={styles.policySection}>
            <div className={styles.sectionHeading}>
              <span aria-hidden="true">05</span>
              <h2>Cookies and Similar Technologies</h2>
            </div>
            <p>
              The Services may use cookies, local storage, and similar
              technologies to operate the product, maintain security, remember
              settings, understand usage, and improve reliability.
            </p>
            <p>
              Where required by law, we will request consent before using
              non-essential cookies or similar technologies and provide a way to
              change your choices. You may also manage cookies through your
              browser settings, although blocking them may affect certain
              functions.
            </p>
          </section>

          <section className={styles.policySection}>
            <div className={styles.sectionHeading}>
              <span aria-hidden="true">06</span>
              <h2>Data Retention</h2>
            </div>
            <p>
              We retain account information for as long as your SmartX account
              remains open and otherwise retain personal data only for as long as
              reasonably necessary to provide and secure the Services, respond
              to support requests, comply with law, resolve disputes, and enforce
              our agreements. We may retain de-identified or aggregated
              information that can no longer reasonably identify a person.
            </p>
            <p>
              When you delete your SmartX account, we will delete or request
              deletion of personal data associated with that account from our
              systems and relevant service providers, unless retention is
              required or permitted for security, fraud prevention, legal
              compliance, or dispute resolution.
            </p>
            <p>
              Public blockchain records and information independently maintained
              by third parties are outside SmartX&apos;s control and may remain
              available indefinitely.
            </p>
          </section>

          <section className={styles.policySection}>
            <div className={styles.sectionHeading}>
              <span aria-hidden="true">07</span>
              <h2>Security</h2>
            </div>
            <p>
              We use reasonable administrative, technical, and organizational
              safeguards designed to protect information against unauthorized
              access, loss, misuse, alteration, or disclosure. However, no
              electronic transmission or storage system is completely secure,
              and we cannot guarantee absolute security.
            </p>
          </section>

          <section className={styles.policySection}>
            <div className={styles.sectionHeading}>
              <span aria-hidden="true">08</span>
              <h2>Your Rights and Choices</h2>
            </div>
            <p>
              Depending on where you live, you may have the right to request
              access to, correction of, or deletion of personal data we hold
              about you; object to or restrict certain processing; withdraw
              consent; or request a portable copy of your data.
            </p>
            <p>
              You may delete your SmartX account through{" "}
              <strong>Settings &gt; Account &gt; Delete Account</strong> or contact
              us at <a href="mailto:support@smartx.io">support@smartx.io</a>.
              Account deletion removes the account and associated personal data,
              subject to the limited retention described above.
            </p>
            <p>
              We may ask for information reasonably necessary to verify a privacy
              or account-deletion request and identify responsive records.
            </p>
            <p>
              To exercise a privacy right, contact us using the details below.
              You may also manage cookies and device permissions through your
              browser or operating-system settings.
            </p>
          </section>

          <section className={styles.policySection}>
            <div className={styles.sectionHeading}>
              <span aria-hidden="true">09</span>
              <h2>Children&apos;s Privacy</h2>
            </div>
            <p>
              The Services are intended for adults and are not directed to anyone
              under 18 years of age. We do not knowingly collect personal data
              from children under 18. If you believe a child has provided
              personal data to us, please contact us so that we can take
              appropriate action.
            </p>
          </section>

          <section className={styles.policySection}>
            <div className={styles.sectionHeading}>
              <span aria-hidden="true">10</span>
              <h2>International Data Transfers</h2>
            </div>
            <p>
              SmartX and its service providers may process information in
              countries other than the country where you live. Where required by
              law, we use appropriate safeguards for international transfers.
            </p>
          </section>

          <section className={styles.policySection}>
            <div className={styles.sectionHeading}>
              <span aria-hidden="true">11</span>
              <h2>Changes to This Privacy Policy</h2>
            </div>
            <p>
              We may update this Privacy Policy as the Services, our information
              practices, or legal requirements change. The updated policy will
              identify a new &quot;Last Updated&quot; date.
            </p>
            <p>
              If we make material changes, we will provide appropriate notice
              through the Services, website, email, or another suitable channel
              and request consent where required by law.
            </p>
          </section>

          <section className={styles.policySection}>
            <div className={styles.sectionHeading}>
              <span aria-hidden="true">12</span>
              <h2>Contact Us</h2>
            </div>
            <p>
              If you have questions, concerns, or privacy requests, contact us
              at:
            </p>
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
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
