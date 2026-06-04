import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/AuthContext";
import QueryProvider from "@/components/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusHub",
  description: "Smart Campus Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}