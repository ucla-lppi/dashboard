export default function Head() {
  // Normalize BASE_PATH env (strip leading/trailing slashes)
  const raw = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const basePath = raw.replace(/^\/+|\/+$/g, '');
  const href = basePath ? `/${basePath}/` : '/';
  const imageUrl = 'https://latinoclimatehealth.org/images/LCHD-fb-linkedin.png';

  return (
    <>
      <base href={href} />
      <link rel="icon" href={`${href}images/ucla_lppi_dashboard_logo.svg`} />
      {/* SEO Meta Tags */}
      <title>UCLA LPPI: Latino Health and Climate Data for California - Insights for Equity</title>
      <meta name="description" content="Access comprehensive data on Latino health disparities and climate issues in California. Explore insights to support research, policymaking, and community health initiatives." />
      <meta name="keywords" content="Latino health data, climate disparities in California, health equity for Latinos, environmental justice" />
      <meta httpEquiv="content-language" content="en-us" />
      <meta name="robots" content="index, follow" />
      {/* Open Graph */}
      <meta property="og:title" content="UCLA LPPI Latino Climate and Health Dashboard" />
      <meta property="og:description" content="Explore data on Latino health and climate disparities in California" />
      <meta property="og:url" content="https://latinoclimatehealth.org/" />
      <meta property="og:image" content="https://latinoclimatehealth.org/images/LCHD-fb-linkedin.png" />
      <meta property="og:image:secure_url" content="https://latinoclimatehealth.org/images/LCHD-fb-linkedin.png" />
      <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="628" />
      <meta property="og:image:alt" content="Latino Climate and Health Dashboard preview" />
      <link rel="image_src" href="https://latinoclimatehealth.org/images/LCHD-fb-linkedin.png" />
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="UCLA LPPI Latino Climate and Health Dashboard" />
      <meta name="twitter:description" content="Explore data on Latino health and climate disparities in California" />
      <meta name="twitter:image" content="https://latinoclimatehealth.org/images/LCHD-fb-linkedin.png" />
      <meta name="twitter:image:alt" content="Latino Climate and Health Dashboard preview" />
      {/* No client-side mutation here: keep head server-rendered so crawlers see meta tags */}
    </>
  );
}