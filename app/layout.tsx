import React from 'react';

export const metadata = {
  title: "OptiLLM Web Chat",
  description: "Chat with OptiLLM backend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
