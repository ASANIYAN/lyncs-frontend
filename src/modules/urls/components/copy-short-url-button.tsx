import * as React from "react";
import { Check, Copy } from "lucide-react";

interface CopyShortUrlButtonProps {
  value: string;
}

const CopyShortUrlButton = ({ value }: CopyShortUrlButtonProps) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center text-lyncs-text-muted hover:text-lyncs-text transition-colors"
      aria-label="Copy short URL"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
};

export default CopyShortUrlButton;

