import type { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/use-chat";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const { isLoading } = useChat();
  const toolPart = message.parts?.find(part => part.type === "tool-invocation");
  const toolName = toolPart?.toolInvocation?.toolName;

  return (
    <div
      className={cn(
        "flex w-full gap-3 rounded-lg px-3 py-2",
        message.isAI ? "bg-gray-100" : "bg-white"
      )}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{message.sender}</span>
          {message.isAI && toolName && (
            <span className="text-sm text-gray-500">
              🛠️ {toolName} {isLoading && "実行中..."}
            </span>
          )}
        </div>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}; 