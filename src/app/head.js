export default function Head() {
  // Normalize BASE_PATH env (strip leading/trailing slashes)
  const raw = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const basePath = raw.replace(/^\/+|\/+$/g, '');
  const href = basePath ? `/${basePath}/` : '/';
  return (
    <>
      <base href={href} />
      {/* SEO Meta Tags */}
      <title>UCLA LPPI: Latino Health and Climate Data for California - Insights for Equity</title>
      <meta name="description" content="Access comprehensive data on Latino health disparities and climate issues in California. Explore insights to support research, policymaking, and community health initiatives." />
      <meta name="keywords" content="Latino health data, climate disparities in California, health equity for Latinos, environmental justice" />
      <meta httpEquiv="content-language" content="en-us" />
      <meta name="robots" content="index, follow" />
      {/* Open Graph */}
      <meta property="og:title" content="UCLA LPPI Latino Data Hub" />
      <meta property="og:description" content="Explore data on Latino health and climate disparities in California" />
      <meta property="og:url" content="https://latinoclimatehealth.org/" />
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="UCLA LPPI Latino Data Hub" />
      <meta name="twitter:description" content="Explore data on Latino health and climate disparities in California" />
      {/* Fallback hack: rewrite any img[src="./images/..."] at runtime */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.addEventListener('DOMContentLoaded', function() {
            var base = '${basePath}';
            var prefix = base ? '/' + base : '';
            document.querySelectorAll('img').forEach(function(img) {
              var src = img.getAttribute('src') || '';
              if (src.startsWith('./images/')) {
                img.src = prefix + '/images/' + src.substring(9);
              }
            });
          });`,
        }}
      />
    </>
  );
}