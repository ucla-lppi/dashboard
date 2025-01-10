// pages/_app.js
import { MDXProvider } from '@mdx-js/react';
import CustomComponent from '../src/app/components/CustomComponent';
import HorizontalScrollWithCSV from '../src/app/components/HorizontalScrollWithCSV';
import Layout from '../src/app/components/Layout'; // Import the Layout component
import '../src/app/styles/globals.css'; // Adjust the path as necessary
import { useRouter } from 'next/router';

const components = {
  CustomComponent,
  HorizontalScrollWithCSV,
  // Add more components here
};

function LppiDashboardApp({ Component, pageProps }) {
  const router = useRouter();
  const excludeProseRoutes = ['/impact']; // Add more routes if needed

  const shouldApplyProse = !excludeProseRoutes.includes(router.pathname);

  return (
    <Layout>
      <MDXProvider components={components}>
        <div className={shouldApplyProse ? 'prose' : ''}>
          <Component {...pageProps} />
        </div>
      </MDXProvider>
    </Layout>
  );
}

export default LppiDashboardApp;