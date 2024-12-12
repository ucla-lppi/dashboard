// pages/_app.js
import { MDXProvider } from '@mdx-js/react';
import CustomComponent from '../src/app/components/CustomComponent';
import HorizontalScrollWithCSV from '../src/app/components/HorizontalScrollWithCSV';
import Layout from '../src/app/components/Layout'; // Import the Layout component
import '../src/app/styles/globals.css'; // Adjust the path as necessary

const components = {
  CustomComponent,
  HorizontalScrollWithCSV,
  // Add more components here
};

function LppiDashboardApp({ Component, pageProps }) {
  return (
    <Layout>
      <MDXProvider components={components}>
        <div>
          <Component {...pageProps} />
        </div>
      </MDXProvider>
    </Layout>
  );
}

export default LppiDashboardApp;