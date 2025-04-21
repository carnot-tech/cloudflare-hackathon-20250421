"use client";

import { Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isRecording: boolean;
  isComposing: boolean;
  setIsComposing: (value: boolean) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onToggleRecording: () => void;
  isLoading?: boolean;
}

export function ChatInput({
  inputValue,
  setInputValue,
  isRecording,
  isComposing,
  setIsComposing,
  onSendMessage,
  onKeyPress,
  onToggleRecording,
  isLoading = false,
}: ChatInputProps) {
  return (
    <div className="flex gap-2">
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={onKeyPress}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder={isRecording ? "Voice recognition in progress..." : "Type a message..."}
        className="flex-1 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-[120px]"
        rows={1}
        disabled={isLoading}
      />
      <Button
        variant={isRecording ? "destructive" : "outline"}
        size="icon"
        onClick={onToggleRecording}
        className="h-[44px] w-[44px]"
        disabled={isLoading}
      >
        <Mic className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        onClick={onSendMessage}
        disabled={!inputValue.trim() || isLoading}
        className="h-[44px] w-[44px]"
      >
        <Send className={`h-4 w-4 ${isLoading ? "animate-pulse" : ""}`} />
      </Button>
    </div>
  );
} 