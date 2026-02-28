export const metadata = {
  title: "Fortilead — AI-Powered MNC",
  description: "Virtual office with 26 AI agents",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
