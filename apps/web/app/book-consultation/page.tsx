"use client";

import { GovtHeader } from "@/components/govt-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Calendar, Clock, Phone, Plus, RefreshCw, User, Users, Video } from "lucide-react";
import { useEffect, useState } from "react";

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
      <div className="h-screen bg-background">
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
            {/* Video Call Header */}
            <div className="bg-card border-b p-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-foreground">Video Consultation - {roomName}</h1>
                <p className="text-sm text-muted-foreground">Connected as: {identity}</p>
              </div>
              <Button onClick={leaveRoom} variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
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
    <div className="min-h-screen bg-background">
      {/* Government Header */}
      <GovtHeader />

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary mb-2">Book Consultation</h1>
              <p className="text-muted-foreground">Start or join a video consultation with healthcare professionals</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Message */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <p className="text-red-600">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Join Room Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Join Video Call
                </CardTitle>
                <p className="text-muted-foreground">
                  Enter room details to join an existing consultation
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
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
                  <label className="text-sm font-medium text-foreground">
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

            {/* Create New Room Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Start New Consultation
                </CardTitle>
                <p className="text-muted-foreground">
                  Create a new video consultation room
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-accent/50 border border-accent/20 rounded-md">
                  <h4 className="font-medium text-accent-foreground">Quick Start</h4>
                  <p className="text-sm text-muted-foreground mt-1">
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
                  <h4 className="font-medium text-foreground mb-2">Pre-made Rooms</h4>
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

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={quickJoinTestRoom}
                    disabled={isJoining || !identity.trim()}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Quick Video Call
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      const randomRoom = `emergency-${Math.floor(Math.random() * 1000)}`;
                      setRoomName(randomRoom);
                      joinRoom(randomRoom);
                    }}
                    disabled={isJoining || !identity.trim()}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Emergency Call
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href="/dashboard"}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Consultations */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Upcoming Consultations
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-accent/10 rounded-lg">
                    <div className="bg-primary text-primary-foreground rounded-full p-2 text-xs font-bold">
                      PS
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Dr. Priya Sharma</p>
                      <p className="text-xs text-muted-foreground">General Medicine</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Today, 10:00 AM</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                      Join
                    </Button>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="bg-secondary text-secondary-foreground rounded-full p-2 text-xs font-bold">
                      RK
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Dr. Rajesh Kumar</p>
                      <p className="text-xs text-muted-foreground">Cardiology</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Tomorrow, 2:30 PM</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Scheduled
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consultation Statistics */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Your Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-muted-foreground">Total Consultations</span>
                    </div>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-muted-foreground">This Month</span>
                    </div>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-muted-foreground">Doctors Consulted</span>
                    </div>
                    <span className="font-semibold">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions Section */}
        <Card className="lg:col-span-3 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              How Video Consultation Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-accent" />
                  <h4 className="font-medium text-foreground">1. Enter Details</h4>
                </div>
                <p className="text-muted-foreground">
                  Provide your name and room name to join the consultation
                </p>
              </div>
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="h-4 w-4 text-accent" />
                  <h4 className="font-medium text-foreground">2. Join Room</h4>
                </div>
                <p className="text-muted-foreground">
                  Click join to enter the secure video call room
                </p>
              </div>
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-accent" />
                  <h4 className="font-medium text-foreground">3. Start Consultation</h4>
                </div>
                <p className="text-muted-foreground">
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