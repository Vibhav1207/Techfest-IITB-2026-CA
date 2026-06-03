import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "TECHFEST 26 - Celebrating 30 Years of Engineering the Future",
  description: "Thirty years of engineering the future. Asia’s largest science and technology festival returns to IIT Bombay — where intelligence becomes a craft.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/images/tf-logo.png", type: "image/png" },
    ],
    apple: "/images/tf-logo.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background font-body-md text-on-background bg-grid min-h-screen flex flex-col relative selection:bg-primary-container selection:text-on-primary-container">
        {children}
      </body>
    </html>
  );
}
