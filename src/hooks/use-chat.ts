import { useState, useRef, useEffect } from "react";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { useChat as useVercelChat } from '@ai-sdk/react'

export const useChat = (isSpeakerOn = true) => {
  const {
    messages: vercelMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
  } = useVercelChat();

  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { speak, stop } = useTextToSpeech();
  const lastMessageRef = useRef<string>("");
  const lastMessageIdRef = useRef<string>("");
  const hasSpokenRef = useRef<boolean>(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const lastMessage = vercelMessages[vercelMessages.length - 1];
    if (lastMessage?.role === "assistant" && isSpeakerOn) {
      if (lastMessage.id !== lastMessageIdRef.current) {
        lastMessageIdRef.current = lastMessage.id;
        lastMessageRef.current = lastMessage.content;
        hasSpokenRef.current = false;
      }
      else if (lastMessage.content !== lastMessageRef.current) {
        lastMessageRef.current = lastMessage.content;
        hasSpokenRef.current = false;
      }

      if (!isLoading && !hasSpokenRef.current && lastMessage.content === lastMessageRef.current) {
        hasSpokenRef.current = true;
        speak(lastMessage.content);
      }
    }
  }, [vercelMessages, isSpeakerOn, speak, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      stop();
      handleSubmit(e);
    }
  };

  const setInputValue = (value: string) => {
    handleInputChange({ target: { value } } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  const sendMessage = (content: string) => {
    stop();
    append({ role: "user", content });
  };

  return {
    messages: vercelMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.role === "assistant" ? "AI" : "You",
      timestamp: new Date(),
      isAI: msg.role === "assistant",
      parts: msg.parts,
      toolInvocations: msg.toolInvocations,
    })),
    inputValue: input,
    setInputValue,
    isComposing,
    setIsComposing,
    isLoading,
    messagesEndRef,
    sendMessage,
    handleKeyPress,
  };
}; 