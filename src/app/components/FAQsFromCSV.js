"use client";

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


const FAQsFromCSV = ({ csvUrl, initialData = [] }) => {
  const [faqs, setFaqs] = useState(initialData);
  const [openIdxs, setOpenIdxs] = useState([]); // allow multiple open

  useEffect(() => {
    // Always fetch latest FAQs data from CSV
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const filtered = results.data
          .map(item => ({
            question: item.question?.trim() || item.Question?.trim() || item.Title?.trim() || "",
            answer: item.answer?.trim() || item.Answer?.trim() || item.File?.trim() || "",
            draft: item.draft?.trim() || item.Draft?.trim() || "",
            id: item.id?.trim() || item.ID?.trim() || "",
          }))
          .filter(item => item.draft?.toLowerCase() !== 'yes' && item.question && item.answer);
        // Sort by numeric id ascending
        filtered.sort((a, b) => Number(a.id) - Number(b.id));
        setFaqs(filtered);
      },
      error: (error) => console.error('Error parsing CSV:', error),
    });
  }, [csvUrl]);

  // If initialData provided, sort and set them immediately
  useEffect(() => {
    if (initialData.length > 0) {
      setFaqs([...initialData].sort((a, b) => Number(a.id) - Number(b.id)));
    }
  }, [initialData]);

  useEffect(() => {
    // If faqs loaded and there's a hash, open that item
    if (faqs.length === 0) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    // Helper to generate slug from question text
    const generateSlug = (text) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const idx = faqs.findIndex(
      (faq) => generateSlug(faq.question) === hash
    );
    if (idx !== -1) {
      setOpenIdxs((prev) => prev.includes(idx) ? prev : [...prev, idx]);
      // Scroll to the anchor element
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [faqs]);

function parseFaqAnswer(answer) {
  if (!answer) return '';
  // inline formatting: escape raw < > first, then inject links & bold
  const parseInline = text => {
    // 1) escape any user-supplied < or >
    const escaped = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // 2) turn markdown links and bold into real HTML
    return escaped
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>'
      )
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  };

  // normalize and split all lines
  const lines = answer.trim().replace(/\r\n/g, '\n').split('\n');

  // collect segments: { type:'ul'|'ol'|'p', lines: [...] }
  const segs = [];
  let curr = null;
  const flush = () => {
    if (!curr) return;
    segs.push(curr);
    curr = null;
  };

  lines.forEach(raw => {
    const line = raw.trimEnd();
    if (/^\s*[-*]\s+/.test(line)) {
      if (curr?.type !== 'ul') { flush(); curr = { type: 'ul', lines: [] }; }
      curr.lines.push(line.replace(/^\s*[-*]\s+/, '').trim());
    }
    else if (/^\s*\d+\.\s+/.test(line)) {
      if (curr?.type !== 'ol') { flush(); curr = { type: 'ol', lines: [] }; }
      curr.lines.push(line.replace(/^\s*\d+\.\s+/, '').trim());
    }
    else {
      flush();
      segs.push({ type: 'p', lines: [line] });
    }
  });
  flush();

  // render HTML
  return segs.map(seg => {
    if (seg.type === 'ul' || seg.type === 'ol') {
      const tag = seg.type;
      const cls = tag === 'ul' ? 'list-disc ml-6' : 'list-decimal ml-6';
      return `<${tag} class="${cls}">` +
        seg.lines.map(li => `<li>${parseInline(li)}</li>`).join('') +
        `</${tag}>`;
    }
    return `<p class="mb-4 text-gray-700">` +
      seg.lines.map(l => parseInline(l)).join('<br/>') +
      `</p>`;
  }).join('');
}

  return (
    <section className="max-w-2xl mx-auto my-8">
      {/* <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2> */}
      <div id="faq-accordion" className="divide-y divide-gray-200 rounded-lg shadow bg-white">
        {faqs.map((faq, idx) => {
          // Generate a slug for the anchor (fallback to idx if no question)
          const slug = faq.question
            ? faq.question
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")
            : `faq-${idx}`;
          return (
            <div key={faq.id || idx}>
              <a id={slug} tabIndex={-1} aria-label={faq.question}></a>
              <button
                type="button"
                className={`flex justify-between items-center w-full py-4 px-4 text-lg font-medium text-left text-gray-900 focus:outline-none transition-colors ${
                  openIdxs.includes(idx) ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50"
                }`}
                aria-expanded={openIdxs.includes(idx)}
                aria-controls={`faq-answer-${idx}`}
                onClick={() =>
                  setOpenIdxs((prev) =>
                    prev.includes(idx)
                      ? prev.filter((i) => i !== idx)
                      : [...prev, idx]
                  )
                }
              >
                <span>{faq.question}</span>
                <svg
                  className={`w-5 h-5 ml-2 transition-transform duration-200 ${openIdxs.includes(idx) ? "rotate-180 text-primary-600" : "rotate-0 text-gray-400"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                id={`faq-answer-${idx}`}
                className={`px-4 pb-4 transition-all duration-200 ${openIdxs.includes(idx) ? "block" : "hidden"}`}
                dangerouslySetInnerHTML={{ __html: parseFaqAnswer(faq.answer) }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQsFromCSV;