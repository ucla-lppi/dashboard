export default function Head() {
  // Determine base href from env (dashboard on GitHub Pages, root on production)
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const href = basePath ? `/${basePath}/` : '/';
  return (
    <>
      <base href={href} />
    </>
  );
}