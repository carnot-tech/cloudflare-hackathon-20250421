"use client";

import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX, Users } from "lucide-react";
import { useState } from "react";

export function VoiceChat() {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsConnected(!isConnected)}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
        <Button variant="outline" size="icon">
          <Users className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-4">
        <Button
          variant={isMicOn ? "default" : "outline"}
          size="icon"
          onClick={() => setIsMicOn(!isMicOn)}
        >
          {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </Button>
        <Button
          variant={isSpeakerOn ? "default" : "outline"}
          size="icon"
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
        >
          {isSpeakerOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Participants</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-white rounded">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>You</span>
          </div>
        </div>
      </div>
    </div>
  );
} 