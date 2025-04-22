export default function Head() {
  // Normalize BASE_PATH env (strip leading/trailing slashes)
  const raw = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const basePath = raw.replace(/^\/+|\/+$/g, '');
  const href = basePath ? `/${basePath}/` : '/';
  return (
    <>
      <base href={href} />
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