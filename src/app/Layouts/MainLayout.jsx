'use client';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

export default function Layout({children }) {


  return (
      <div className="min-h-screen flex flex-col bg-white text-darkGray relative">
        <Header />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </div>
  );
}
