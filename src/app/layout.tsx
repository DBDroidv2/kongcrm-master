import AuthSessionProvider from '@/components/AuthSessionProvider'; // Import the new AuthSessionProvider client component
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import WipPopup from '@/components/WipPopup';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper'; // New wrapper

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'KongCRM - Customer Relationship Management',
  description: 'A modern CRM system for managing customers and activities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayoutWrapper> {/* Wrap content with client component */}
          <AuthSessionProvider> {/* Wrap content with AuthSessionProvider for authentication */}
            <WipPopup />
            <div className="min-h-screen bg-gray-100">
              <Header />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                  {children}
                </main>
              </div>
            </div>
          </AuthSessionProvider>
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
