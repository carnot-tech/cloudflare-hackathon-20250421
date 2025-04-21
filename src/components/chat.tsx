"use client";

import { Bot, Volume2, VolumeX } from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { MessageList } from "@/components/message-list";
import { ChatInput } from "@/components/chat-input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Chat() {
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const {
    messages,
    inputValue,
    setInputValue,
    isComposing,
    setIsComposing,
    isLoading,
    messagesEndRef,
    sendMessage,
    handleKeyPress,
  } = useChat(isSpeakerOn);

  const { isRecording, toggleRecording } = useSpeechRecognition(
    (transcript) => sendMessage(transcript)
  );

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-500" />
            <h1 className="text-xl font-semibold">AI Chat</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isSpeakerOn ? "default" : "outline"}
              size="icon"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            >
              {isSpeakerOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-green-500'}`} />
            <span className="text-sm text-gray-500">
              {isRecording ? 'Voice recognition in progress' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* メッセージ表示エリア */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        </div>
      </div>

      {/* 入力エリア */}
      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            isRecording={isRecording}
            isComposing={isComposing}
            setIsComposing={setIsComposing}
            onSendMessage={() => sendMessage(inputValue)}
            onKeyPress={handleKeyPress}
            onToggleRecording={toggleRecording}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
} 