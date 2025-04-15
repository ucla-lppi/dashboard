"use client";
import React from "react";
import { Card } from "flowbite-react";
import HomePage from "../components/HomePage"; // Adjust the path if necessary

// Dynamically read all MDX files from the content folder using require.context
// Changed '@content' to the relative path from this file: ../../../content
const mdxContext = require.context("../../../content", false, /\.mdx$/);
const dynamicComponents = mdxContext.keys().reduce((acc, key) => {
  // key format is "./FileName.mdx"
  const mod = mdxContext(key);
  const name = key.replace("./", "").replace(".mdx", "");
  acc[name] = mod.default || mod.MDXContent; // Use MDXContent if default is unavailable
  return acc;
}, {});

// Merge dynamic MDX components then override "Home" with HomePage
const components = {
  ...dynamicComponents,
  Home: HomePage, // For Home, load homepage.js component
};

export default function MainContent({ activeItem }) {
  const ContentComponent =
    components[activeItem] || (() => <div>Page not found.</div>);
  const isMDX = activeItem !== "Home";
  return (
    <Card className="bg-[#fcfcfc] dark:bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-auto border-0">
      {isMDX ? (
        <article className="prose lg:prose-xl">
          <ContentComponent />
        </article>
      ) : (
        <ContentComponent />
      )}
    </Card>
  );
}