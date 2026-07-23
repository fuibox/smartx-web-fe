import Script from "next/script";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Script src="/blog-theme.js" strategy="beforeInteractive" />
      {children}
    </>
  );
}
