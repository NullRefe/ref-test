"use client"
import { GovtHeader } from "@/components/govt-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Mic, MicOff, Monitor, PhoneOff, Video, VideoOff } from "lucide-react"
import { useEffect, useState } from "react"

interface VideoCallProps {
  doctorName: string
  doctorSpecialty: string
  patientName: string
  consultationId: string
}

export function VideoCall({ doctorName, doctorSpecialty, patientName, consultationId }: VideoCallProps) {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "poor" | "disconnected">(
    "connecting",
  )

  useEffect(() => {
    // Simulate connection process
    const timer = setTimeout(() => {
      setConnectionStatus("connected")
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Call duration timer
    if (connectionStatus === "connected") {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [connectionStatus])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case "connecting":
        return <Badge variant="secondary">Connecting...</Badge>
      case "connected":
        return <Badge className="bg-green-500">Connected</Badge>
      case "poor":
        return <Badge variant="destructive">Poor Connection</Badge>
      case "disconnected":
        return <Badge variant="destructive">Disconnected</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GovtHeader />
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-lg font-serif font-semibold">Video Consultation</h1>
              <p className="text-sm text-muted-foreground">
                {doctorName} • {doctorSpecialty}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {getConnectionBadge()}
            {connectionStatus === "connected" && (
              <div className="text-sm font-mono">{formatDuration(callDuration)}</div>
            )}
          </div>
        </div>
      </header>

      {/* Video Area */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          {/* Main Video */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <div className="relative h-full bg-muted rounded-lg overflow-hidden">
                  {connectionStatus === "connecting" ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground">Connecting to {doctorName}...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Doctor's Video */}
                      <div className="h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <div className="text-center">
                          <Avatar className="h-24 w-24 mx-auto mb-4">
                            <AvatarImage src="/placeholder.svg?height=96&width=96" />
                            <AvatarFallback className="text-2xl">
                              {doctorName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="text-xl font-serif font-semibold">{doctorName}</h3>
                          <p className="text-muted-foreground">{doctorSpecialty}</p>
                        </div>
                      </div>

                      {/* Patient's Video (Picture-in-Picture) */}
                      <div className="absolute bottom-4 right-4 w-48 h-36 bg-muted border-2 border-background rounded-lg overflow-hidden">
                        <div className="h-full bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center">
                          <div className="text-center">
                            <Avatar className="h-12 w-12 mx-auto mb-2">
                              <AvatarImage src="/placeholder.svg?height=48&width=48" />
                              <AvatarFallback>
                                {patientName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-medium">{patientName}</p>
                            <p className="text-xs text-muted-foreground">You</p>
                          </div>
                        </div>
                        {!isVideoOn && (
                          <div className="absolute inset-0 bg-muted flex items-center justify-center">
                            <VideoOff className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Call Controls */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-serif font-semibold mb-4">Call Controls</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={isVideoOn ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className="flex items-center space-x-2"
                  >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    <span>{isVideoOn ? "Video On" : "Video Off"}</span>
                  </Button>
                  <Button
                    variant={isAudioOn ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setIsAudioOn(!isAudioOn)}
                    className="flex items-center space-x-2"
                  >
                    {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    <span>{isAudioOn ? "Mic On" : "Mic Off"}</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                    <Monitor className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat</span>
                  </Button>
                </div>
                <Button variant="destructive" size="sm" className="w-full mt-4 flex items-center space-x-2">
                  <PhoneOff className="h-4 w-4" />
                  <span>End Call</span>
                </Button>
              </CardContent>
            </Card>

            {/* Connection Quality */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-serif font-semibold mb-4">Connection Quality</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Video Quality</span>
                    <Badge variant="secondary">HD</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Audio Quality</span>
                    <Badge variant="secondary">Good</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Network</span>
                    <Badge className="bg-green-500">Stable</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Notes */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-serif font-semibold mb-4">Quick Notes</h3>
                <div className="space-y-2 text-sm">
                  <p>• Patient reports mild headache</p>
                  <p>• Blood pressure: 120/80</p>
                  <p>• No fever symptoms</p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                  Add Note
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
