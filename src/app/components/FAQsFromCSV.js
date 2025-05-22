import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

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

  // Utility to convert [text](url) to <a href="url">text</a>, \n to <br/>, and lines starting with - or * to <ul><li>...</li></ul>
  function parseFaqAnswer(answer) {
    if (!answer) return null;
    let html = answer;
    // Convert [text](url) to <a href="url">text</a>
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>');
    // Convert triple-backtick code blocks to <pre><code>
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => `<pre class="bg-gray-100 rounded p-2 my-2"><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`);
    // Convert lines starting with - or * to <ul><li>...</li></ul>
    if (/^\s*[-*] /m.test(html)) {
      html = html.replace(/(^|\n)([-*] .*(?:\n[-*] .*)*)/g, (m, p1, p2) => {
        const items = p2.split(/\n/).map(line => line.replace(/^[-*] /, '').trim());
        return `<ul class="list-disc ml-6">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
      });
    }
    // Convert newlines to <br/>, but not inside <ul> or <pre>
    html = html.replace(/\n/g, '<br/>');
    return html;
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
                className={`px-4 pb-4 text-gray-700 transition-all duration-200 ${openIdxs.includes(idx) ? "block" : "hidden"}`}
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