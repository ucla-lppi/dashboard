import { Lexend_Deca, Lexend_Zetta } from 'next/font/google';
import { metadata } from './metadata';
import SideNavigation from './components/SideNavigation';
import ContentContainer from './components/ContentContainer';
import MainContent from './components/MainContent';

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-lexend-deca',
});

export { metadata };

export default function Home({ children }) {
  return (
    <div className={`${lexendDeca.className} min-h-screen grid grid-cols-[250px_1fr] grid-rows-[calc(100vh-150px)_150px]`}>
      {/* Left Sidebar */}
      <div>
        <SideNavigation />
      </div>

      {/* Content area (right column) */}
      <div className="relative">
        <ContentContainer />
        <div className="absolute inset-0 flex items-center justify-center z-10 text-center">
          <div>
            <MainContent />
            <main>
              {children}
            </main>
          </div>
        </div>
      </div>

      {/* Footer spanning both columns */}
      <footer className="col-span-2 bg-brandPink text-white p-4 text-center">
        Footer content goes here.
      </footer>
    </div>
  );
}