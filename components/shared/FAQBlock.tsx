interface FAQItem {
  question: string;
  answer: React.ReactNode;
  schemaAnswer?: string;
}

interface FAQBlockProps {
  items: FAQItem[];
  heading?: string;
  includeSchema?: boolean;
  className?: string;
}

export function FAQBlock({
  items,
  heading = 'Frequently asked questions',
  includeSchema = true,
  className = '',
}: FAQBlockProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items
  .filter((item) => typeof item.answer === 'string' || item.schemaAnswer)
  .map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.schemaAnswer ?? (typeof item.answer === 'string' ? item.answer : ''),
    },
  })),
  };

  return (
    <>
      {includeSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <section className={className} aria-labelledby="faq-heading">
        <h2
          id="faq-heading"
          className="font-serif text-[32px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-12"
        >
          {heading}
        </h2>
        <dl className="divide-y divide-[var(--border)]">
          {items.map((item) => (
            <div key={item.question} className="py-7">
              <dt>
                <h3 className="font-serif text-[20px] font-bold text-[var(--text-primary)] leading-[1.30] tracking-[-0.01em] mb-3">
                  {item.question}
                </h3>
              </dt>
              <dd>
                <p className="text-[17px] text-[var(--text-secondary)] leading-[1.60] m-0">
                  {item.answer}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}