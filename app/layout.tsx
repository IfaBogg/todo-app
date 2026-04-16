export const metadata = {
  title: "Todo App",
  description: "My first Next.js Todo App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: "10px", background: "#eee" }}>
          <h2>📝 Todo App</h2>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}