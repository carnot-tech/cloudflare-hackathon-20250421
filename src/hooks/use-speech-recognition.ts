import { useState, useRef, useCallback } from "react";
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from "@/types/chat";

export type Language = "en-US" | "ja-JP";

export const useSpeechRecognition = (onFinalTranscript: (transcript: string) => void, language: Language = "en-US") => {
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");

  const initializeRecognition = useCallback(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        
        if (event.results[event.results.length - 1].isFinal) {
          finalTranscriptRef.current = transcript;
          setInterimTranscript(transcript);
        } else {
          setInterimTranscript(transcript);
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        if (finalTranscriptRef.current.trim()) {
          onFinalTranscript(finalTranscriptRef.current);
          finalTranscriptRef.current = "";
        }
        setInterimTranscript("");
      };
    }
  }, [onFinalTranscript, language]);

  const startRecording = useCallback(() => {
    if (!recognitionRef.current || recognitionRef.current.lang !== language) {
      initializeRecognition();
    }
    if (recognitionRef.current) {
      finalTranscriptRef.current = "";
      recognitionRef.current.start();
      setIsRecording(true);
    }
  }, [initializeRecognition, language]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    interimTranscript,
    toggleRecording,
  };
}; 