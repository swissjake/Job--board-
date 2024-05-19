import ReactMarkdown from "react-markdown";

interface MarkdownProps {
  children: string;
}
const Markdown = ({ children }: MarkdownProps) => {
  return (
    <ReactMarkdown
      className={"spacey-y-3"}
      components={{
        ul: (props) => <ul className="list-inside list-disc" {...props} />,
        a: (props) => (
          <a className="text-green-500 underline" target="_blank" {...props} />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
