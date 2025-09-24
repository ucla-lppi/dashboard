"use client";

import Head from "next/head";

export default function Meta({
  title = "My Dashboard",
  description = "Some description",
  ogImage = "https://latinoclimatehealth.org/images/LCHD-fb-linkedin.png",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {/* add any other meta or link tags here */}
    </Head>
  );
}
