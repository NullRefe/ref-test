"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference, useRoomContext } from "@livekit/components-react";
import "@livekit/components-styles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Video, Users, Plus, RefreshCw } from "lucide-react";

export default function ConsulationPage() {
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [identity, setIdentity] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInCall, setIsInCall] = useState(false);

  // Generate random identity on component mount
  useEffect(() => {
    const randomIdentity = "user-" + Math.floor(Math.random() * 10000);
    setIdentity(randomIdentity);
  }, []);

  const joinRoom = async (room: string) => {
    if (!room.trim() || !identity.trim()) {
      setError("Please enter both room name and identity");
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      console.log("🔄 Joining room:", { room, identity });
      
      const response = await fetch(
        `/api/livekit/token?identity=${encodeURIComponent(identity)}&room=${encodeURIComponent(room)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Token received for dashboard:", data);
      
      setToken(data.token);
      setUrl(data.url);
      setIsInCall(true);
    } catch (err) {
      console.error("❌ Error joining room:", err);
      setError(err instanceof Error ? err.message : "Failed to join room");
    } finally {
      setIsJoining(false);
    }
  };

  const leaveRoom = () => {
    setToken(null);
    setUrl(null);
    setIsInCall(false);
    setError(null);
  };

  const quickJoinTestRoom = () => {
    setRoomName("test-room");
    joinRoom("test-room");
  };

  // If in a call, show the video interface
  if (isInCall && token && url) {
    return (
      <div className="h-screen">
        <LiveKitRoom
          serverUrl={url}
          token={token}
          connect={true}
          video={true}
          audio={true}
          onDisconnected={() => leaveRoom()}
          onError={(error) => {
            console.error("LiveKit error:", error);
            setError(error.message);
          }}
          style={{ height: "100%" }}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 border-b p-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold">Video Call - {roomName}</h1>
                <p className="text-sm text-gray-600">Connected as: {identity}</p>
              </div>
              <Button onClick={leaveRoom} variant="outline" size="sm">
                Leave Call
              </Button>
            </div>

            {/* Video Conference */}
            <div className="flex-1">
              <VideoConference />
            </div>
          </div>
        </LiveKitRoom>
      </div>
    );
  }

  // Main dashboard interface
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 relative">
              <Video className="h-6 w-6" />
              Video Call Dashboard
               <button onClick={()=>window.location.href="/dashboard"} className="absolute right-10 top-1 text-white py-2 px-10 bg-[#1F9BB9] rounded-md">Dashboard</button>
            </CardTitle>
           
            <p className="text-gray-600">
              Start or join a video consultation
            </p>
          

          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Join Room Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Join Video Call</CardTitle>
              <p className="text-sm text-gray-600">
                Enter room details to join an existing consultation
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Your Name/Identity
                </label>
                <Input
                  type="text"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Room Name
                </label>
                <Input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name"
                  className="mt-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      joinRoom(roomName);
                    }
                  }}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={() => joinRoom(roomName)}
                  disabled={isJoining || !roomName.trim() || !identity.trim()}
                  className="flex-1"
                >
                  {isJoining ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Join Room
                    </>
                  )}
                </Button>

                <Button 
                  onClick={quickJoinTestRoom}
                  disabled={isJoining || !identity.trim()}
                  variant="outline"
                >
                  Quick Test
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Create Room Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Start New Consultation</CardTitle>
              <p className="text-sm text-gray-600">
                Create a new video consultation room
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-medium text-blue-900">Quick Start</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Generate a random room name and join immediately
                </p>
              </div>

              <Button 
                onClick={() => {
                  const randomRoom = `room-${Math.floor(Math.random() * 10000)}`;
                  setRoomName(randomRoom);
                  joinRoom(randomRoom);
                }}
                disabled={isJoining || !identity.trim()}
                className="w-full"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create & Join Random Room
              </Button>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Pre-made Rooms</h4>
                <div className="space-y-2">
                  {['consultation-1', 'emergency-room', 'follow-up-123'].map((room) => (
                    <Button
                      key={room}
                      onClick={() => {
                        setRoomName(room);
                        joinRoom(room);
                      }}
                      disabled={isJoining || !identity.trim()}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Badge variant="secondary" className="mr-2">
                        {room}
                      </Badge>
                      Join this room
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How it Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-900">1. Enter Details</h4>
                <p className="text-blue-700 mt-1">
                  Provide your name and room name to join
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-md">
                <h4 className="font-medium text-green-900">2. Join Room</h4>
                <p className="text-green-700 mt-1">
                  Click join to enter the video call
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-md">
                <h4 className="font-medium text-purple-900">3. Start Talking</h4>
                <p className="text-purple-700 mt-1">
                  Use controls to manage video, audio, and screen sharing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}