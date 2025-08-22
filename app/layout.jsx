import "./globals.css";
export const metadata = { title: "ROAR.Mining", description: "Roar first mockup UI with animations" };
export default function RootLayout({ children }){
  return (
    <html lang="en">
      <body className="antialiased bg-black">{children}</body>
    </html>
  );
}
