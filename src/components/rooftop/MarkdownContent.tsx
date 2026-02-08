"use client";

import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  markdown: string;
  className?: string;
}

export function MarkdownContent({ markdown, className }: MarkdownContentProps) {
  return (
    <div
      className={`text-[#504436] [font-family:var(--font-note-serif),serif] leading-loose ${className ?? ""}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ ...props }) => (
            <h1 className="mb-3 text-[1.45em] font-semibold text-[#4a3e32]" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="mb-3 text-[1.3em] font-semibold text-[#4a3e32]" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="mb-2 text-[1.15em] font-semibold text-[#4a3e32]" {...props} />
          ),
          p: ({ ...props }) => <p className="mb-3 leading-loose" {...props} />,
          ul: ({ ...props }) => <ul className="mb-3 list-disc space-y-1 pl-5" {...props} />,
          ol: ({ ...props }) => (
            <ol className="mb-3 list-decimal space-y-1 pl-5" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote
              className="mb-3 border-l-3 border-[#d8c3a5] bg-[#f6eee2]/60 px-3 py-2 italic text-[#675543]"
              {...props}
            />
          ),
          code: ({ className: codeClassName, ...props }) => {
            const isBlock = Boolean(codeClassName);
            if (isBlock) {
              return (
                <code
                  className="block overflow-x-auto rounded-lg bg-[#efe3d1] px-3 py-2 text-[0.92em] [font-family:var(--font-geist-mono),monospace]"
                  {...props}
                />
              );
            }
            return (
              <code
                className="rounded bg-[#efe3d1] px-1.5 py-0.5 text-[0.9em] [font-family:var(--font-geist-mono),monospace]"
                {...props}
              />
            );
          },
          a: ({ ...props }) => (
            <a
              className="text-[#7f6248] underline decoration-[#b69370]/70 underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
