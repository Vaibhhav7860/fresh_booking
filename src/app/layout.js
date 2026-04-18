import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'FreshBooking - Find Your Dream Home | Buy, Sell, Rent Properties in India',
  description: 'FreshBooking is India\'s most innovative real estate platform. Buy, sell, or rent properties with ease. Explore thousands of listings across Mumbai, Delhi, Bangalore, Hyderabad, Pune, Chennai and more.',
  keywords: 'real estate, property, buy property, rent property, sell property, flats, apartments, houses, villas, plots, India, Mumbai, Delhi, Bangalore',
  openGraph: {
    title: 'FreshBooking - Find Your Dream Home',
    description: 'India\'s most innovative real estate platform. Buy, sell, or rent properties with ease.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'FreshBooking',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FreshBooking - Find Your Dream Home',
    description: 'India\'s most innovative real estate platform.',
  },
  robots: 'index, follow',
  verification: {},
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AuthProvider>
          <Header />
          <main style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
