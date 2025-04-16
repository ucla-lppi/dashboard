import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const FAQsFromCSV = ({ csvUrl }) => {
  const [faqs, setFaqs] = useState([]);
  const [openIdx, setOpenIdx] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          delimiter: ",",
          skipEmptyLines: true,
          complete: (results) => {
            // If your CSV has columns: question, answer, draft, id
            const filtered = results.data
              .map(item => ({
                question: item.question?.trim() || item.Question?.trim() || item.Title?.trim() || "",
                answer: item.answer?.trim() || item.Answer?.trim() || item.File?.trim() || "",
                draft: item.draft?.trim() || item.Draft?.trim() || "",
                id: item.id?.trim() || item.ID?.trim() || "",
              }))
              .filter(
                (item) =>
                  item.draft?.toLowerCase() !== 'yes' &&
                  item.question &&
                  item.answer
              );
            setFaqs(filtered);
          },
          error: (error) => console.error('Error parsing CSV:', error),
        });
      } catch (error) {
        console.error('Error fetching CSV:', error);
      }
    };
    fetchData();
  }, [csvUrl]);

  return (
    <section className="max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
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
                  openIdx === idx ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50"
                }`}
                aria-expanded={openIdx === idx}
                aria-controls={`faq-answer-${idx}`}
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                <span>{faq.question}</span>
                <svg
                  className={`w-5 h-5 ml-2 transition-transform duration-200 ${openIdx === idx ? "rotate-180 text-primary-600" : "rotate-0 text-gray-400"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                id={`faq-answer-${idx}`}
                className={`px-4 pb-4 text-gray-700 transition-all duration-200 ${openIdx === idx ? "block" : "hidden"}`}
              >
                {faq.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQsFromCSV;