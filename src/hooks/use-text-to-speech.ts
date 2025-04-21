"use client";

import { useState } from "react";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

type Voice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" | "coral" | "ash" | "sage";

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const speak = async (text: string) => {
    if (!text.trim()) {
      return;
    }

    try {
      if (audioElement) {
        audioElement.pause();
        setIsPlaying(false);
      }

      setIsPlaying(true);

      const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy" as Voice,
        speed: 1.5,
        input: text,
      });

      const audioData = await response.arrayBuffer();
      const blob = new Blob([audioData], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      setAudioElement(audio);

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };

      await audio.play();
    } catch (error) {
      console.error("Text-to-speech error:", error);
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
  };

  return {
    speak,
    stop,
    isPlaying,
  };
}; 