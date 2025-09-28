"use client";

import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  VideoConference,
  useRoomContext,
  RoomAudioRenderer,
  ParticipantLoop,
  TrackLoop,
  useParticipants,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  PhoneOff,
  Users,
  Settings,
  MessageSquare
} from "lucide-react";

interface VideoCallProps {
  doctorName: string;
  doctorSpecialty: string;
  patientName: string;
  consultationId: string;
}

export function VideoCall({
  doctorName,
  doctorSpecialty,
  patientName,
  consultationId,
}: VideoCallProps) {
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "reconnecting"
  >("connecting");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setConnectionStatus("connecting");
        setError(null);
        
        console.log("🔄 Fetching token for:", { consultationId, patientName });
        
        const response = await fetch(
          `/api/livekit/token?room=${encodeURIComponent(consultationId)}&identity=${encodeURIComponent(patientName)}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Token received:", { 
          hasToken: !!data.token, 
          url: data.url,
          identity: data.identity,
          room: data.room 
        });
        
        setToken(data.token);
        setUrl(data.url);
      } catch (err) {
        console.error("❌ Token fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to get access token");
        setConnectionStatus("disconnected");
      }
    };

    fetchToken();
  }, [consultationId, patientName]);

  const handleConnect = () => {
    console.log("🔗 Connected to room");
    setConnectionStatus("connected");
    setError(null);
  };

  const handleDisconnect = () => {
    console.log("🔌 Disconnected from room");
    setConnectionStatus("disconnected");
  };

  const handleReconnecting = () => {
    console.log("🔄 Reconnecting to room");
    setConnectionStatus("reconnecting");
  };

  const handleError = (error: Error) => {
    console.error("❌ LiveKit Room Error:", error);
    setError(error.message);
    setConnectionStatus("disconnected");
  };

  // Loading state
  if (!token || !url) {
    return (
      <Card className="w-full h-screen">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-lg">
              {error ? `❌ ${error}` : "🔄 Connecting to consultation room..."}
            </p>
            {error && (
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="mt-4"
              >
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-screen">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-gray-900">
              Consultation with {doctorName}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {doctorSpecialty} • Room: {consultationId}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ConnectionStatus status={connectionStatus} />
            {error && (
              <Badge variant="destructive" className="text-xs">
                Connection Error
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 h-full flex flex-col">
        <LiveKitRoom
          token={token}
          serverUrl={url}
          connect={true}
          video={true}
          audio={true}
          onConnected={handleConnect}
          onDisconnected={handleDisconnect}
          onReconnecting={handleReconnecting}
          onError={handleError}
          options={{
            adaptiveStream: true,
            dynacast: true,
            publishDefaults: {
              videoResolution: {
                width: 1280,
                height: 720,
                frameRate: 15,
              },
            },
          }}
          className="flex-1"
        >
          {/* Audio renderer for remote participants */}
          <RoomAudioRenderer />
          
          {/* Main video conference UI */}
          <div className="flex-1 relative">
            <VideoConference />
          </div>
          
          {/* Custom control bar */}
          <EnhancedControlBar 
            doctorName={doctorName}
            patientName={patientName}
          />
        </LiveKitRoom>
      </CardContent>
    </Card>
  );
}

function ConnectionStatus({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "connecting":
      case "reconnecting":
        return "bg-yellow-500";
      case "disconnected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
      <span className="text-xs text-gray-600 capitalize">
        {status === "reconnecting" ? "Reconnecting..." : status}
      </span>
    </div>
  );
}

function EnhancedControlBar({
  doctorName,
  patientName,
}: {
  doctorName: string;
  patientName: string;
}) {
  const room = useRoomContext();
  const participants = useParticipants();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const toggleVideo = async () => {
    try {
      const newState = !isVideoOn;
      await room.localParticipant.setCameraEnabled(newState);
      setIsVideoOn(newState);
    } catch (error) {
      console.error("Error toggling video:", error);
    }
  };

  const toggleAudio = async () => {
    try {
      const newState = !isAudioOn;
      await room.localParticipant.setMicrophoneEnabled(newState);
      setIsAudioOn(newState);
    } catch (error) {
      console.error("Error toggling audio:", error);
    }
  };

  const toggleScreenShare = async () => {
    try {
      const newState = !isScreenSharing;
      await room.localParticipant.setScreenShareEnabled(newState);
      setIsScreenSharing(newState);
    } catch (error) {
      console.error("Error toggling screen share:", error);
    }
  };

  const leaveRoom = async () => {
    try {
      await room.disconnect();
      // In a real app, you might want to redirect to a "call ended" page
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border-t">
      {/* Participant info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{participants.length} participant{participants.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex justify-center space-x-3">
        <Button 
          variant={isVideoOn ? "outline" : "secondary"} 
          size="icon" 
          onClick={toggleVideo}
          className={!isVideoOn ? "bg-red-100 hover:bg-red-200" : ""}
        >
          {isVideoOn ? (
            <Video className="h-5 w-5" />
          ) : (
            <VideoOff className="h-5 w-5 text-red-600" />
          )}
        </Button>

        <Button 
          variant={isAudioOn ? "outline" : "secondary"} 
          size="icon" 
          onClick={toggleAudio}
          className={!isAudioOn ? "bg-red-100 hover:bg-red-200" : ""}
        >
          {isAudioOn ? (
            <Mic className="h-5 w-5" />
          ) : (
            <MicOff className="h-5 w-5 text-red-600" />
          )}
        </Button>

        <Button 
          variant={isScreenSharing ? "default" : "outline"} 
          size="icon" 
          onClick={toggleScreenShare}
        >
          <Monitor className="h-5 w-5" />
        </Button>

        <Button 
          variant="outline" 
          size="icon"
          onClick={() => {
            // You can implement chat functionality here
            console.log("Chat clicked");
          }}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>

        <Button 
          variant="outline" 
          size="icon"
          onClick={() => {
            // You can implement settings here
            console.log("Settings clicked");
          }}
        >
          <Settings className="h-5 w-5" />
        </Button>

        <Button 
          variant="destructive" 
          size="icon" 
          onClick={leaveRoom}
          className="ml-4"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>

      {/* Empty space for balance */}
      <div className="w-20"></div>
    </div>
  );
}