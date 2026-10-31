export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><meta httpEquiv="refresh" content="0; url=./en/" /></head>
      <body style={{ fontFamily: "system-ui", padding: 24 }}>{children}</body>
    </html>
  );
}
