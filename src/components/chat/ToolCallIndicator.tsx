interface ToolCallIndicatorProps {
  toolName: string;
}

const TOOL_LABELS: Record<string, string> = {
  retrieve_documents: "Searching documents",
  search: "Searching",
};

export function ToolCallIndicator({ toolName }: ToolCallIndicatorProps) {
  const label = TOOL_LABELS[toolName] ?? `Running ${toolName}`;

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span>{label}...</span>
    </div>
  );
}
