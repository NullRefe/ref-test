// "use client";

// import { VideoCall } from "@/components/video";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Suspense } from "react";
// import { 
//   Calendar, 
//   Clock, 
//   User, 
//   Stethoscope,
//   ArrowLeft,
//   Phone,
//   MessageSquare 
// } from "lucide-react";
// import Link from "next/link";

// interface Props {
//   params: { id: string };
//   searchParams: { identity?: string };
// }

// // Sample consultation data - in a real app, this would come from your database
// const getConsultationDetails = (id: string) => {
//   const consultations = {
//     'cons-001': {
//       id: 'cons-001',
//       doctor: {
//         name: 'Dr. Sarah Johnson',
//         specialty: 'Cardiologist',
//         avatar: '/api/placeholder/100/100',
//         rating: 4.9,
//         experience: '15+ years'
//       },
//       patient: {
//         name: 'John Smith',
//         age: 45,
//         condition: 'Regular Checkup'
//       },
//       appointment: {
//         date: '2024-12-15',
//         time: '14:30',
//         duration: '30 minutes',
//         type: 'Video Consultation'
//       },
//       status: 'active'
//     },
//     'test-room': {
//       id: 'test-room',
//       doctor: {
//         name: 'Dr. Test Doctor',
//         specialty: 'General Practice',
//         avatar: '/api/placeholder/100/100',
//         rating: 5.0,
//         experience: '10+ years'
//       },
//       patient: {
//         name: 'Test Patient',
//         age: 30,
//         condition: 'Test Consultation'
//       },
//       appointment: {
//         date: new Date().toISOString().split('T')[0],
//         time: new Date().toLocaleTimeString('en-US', { 
//           hour: '2-digit', 
//           minute: '2-digit',
//           hour12: false 
//         }),
//         duration: '30 minutes',
//         type: 'Video Consultation'
//       },
//       status: 'active'
//     }
//   };

//   return consultations[id as keyof typeof consultations] || {
//     id,
//     doctor: {
//       name: 'Dr. Unknown',
//       specialty: 'General Practice',
//       avatar: '/api/placeholder/100/100',
//       rating: 0,
//       experience: 'N/A'
//     },
//     patient: {
//       name: 'Unknown Patient',
//       age: 0,
//       condition: 'General Consultation'
//     },
//     appointment: {
//       date: new Date().toISOString().split('T')[0],
//       time: new Date().toLocaleTimeString('en-US', { 
//         hour: '2-digit', 
//         minute: '2-digit',
//         hour12: false 
//       }),
//       duration: '30 minutes',
//       type: 'Video Consultation'
//     },
//     status: 'active'
//   };
// };

// function ConsultationHeader({ consultation, identity }: { 
//   consultation: ReturnType<typeof getConsultationDetails>, 
//   identity: string 
// }) {
//   return (
//     <div className="bg-white border-b border-gray-200 px-4 py-3">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <Link href="/dashboard">
//             <Button variant="ghost" size="sm">
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back
//             </Button>
//           </Link>
          
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//               <Stethoscope className="h-5 w-5 text-blue-600" />
//             </div>
//             <div>
//               <h1 className="text-lg font-semibold text-gray-900">
//                 {consultation.doctor.name}
//               </h1>
//               <p className="text-sm text-gray-600">
//                 {consultation.doctor.specialty} • {consultation.doctor.experience}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center space-x-4">
//           <div className="text-right text-sm">
//             <div className="flex items-center text-gray-600">
//               <Calendar className="h-4 w-4 mr-1" />
//               {new Date(consultation.appointment.date).toLocaleDateString()}
//             </div>
//             <div className="flex items-center text-gray-600 mt-1">
//               <Clock className="h-4 w-4 mr-1" />
//               {consultation.appointment.time} • {consultation.appointment.duration}
//             </div>
//           </div>
          
//           <Badge 
//             variant={consultation.status === 'active' ? 'default' : 'secondary'}
//             className="capitalize"
//           >
//             {consultation.status}
//           </Badge>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ConsultationSidebar({ consultation, identity }: { 
//   consultation: ReturnType<typeof getConsultationDetails>, 
//   identity: string 
// }) {
//   return (
//     <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 space-y-4">
//       {/* Patient Info */}
//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle className="text-sm font-medium flex items-center">
//             <User className="h-4 w-4 mr-2" />
//             Patient Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-2">
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-600">Name:</span>
//             <span className="font-medium">{identity}</span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-600">Age:</span>
//             <span className="font-medium">{consultation.patient.age} years</span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-600">Condition:</span>
//             <span className="font-medium">{consultation.patient.condition}</span>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Doctor Info */}
//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle className="text-sm font-medium flex items-center">
//             <Stethoscope className="h-4 w-4 mr-2" />
//             Doctor Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-2">
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-600">Rating:</span>
//             <span className="font-medium">
//               ⭐ {consultation.doctor.rating}/5.0
//             </span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-600">Experience:</span>
//             <span className="font-medium">{consultation.doctor.experience}</span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-600">Specialty:</span>
//             <span className="font-medium">{consultation.doctor.specialty}</span>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Quick Actions */}
//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-2">
//           <Button variant="outline" size="sm" className="w-full justify-start">
//             <MessageSquare className="h-4 w-4 mr-2" />
//             Chat
//           </Button>
//           <Button variant="outline" size="sm" className="w-full justify-start">
//             <Phone className="h-4 w-4 mr-2" />
//             Audio Only
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Consultation Notes */}
//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle className="text-sm font-medium">Session Notes</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-sm text-gray-600">
//             <p>• Check vital signs</p>
//             <p>• Discuss symptoms</p>
//             <p>• Review medication</p>
//             <p>• Schedule follow-up</p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default function ConsultationPage({ params, searchParams }: Props) {
//   const { id } = params;
//   const identity = searchParams.identity || `Patient-${Math.floor(Math.random() * 1000)}`;
  
//   const consultation = getConsultationDetails(id);

//   return (
//     <div className="h-screen flex flex-col bg-gray-100">
//       {/* Header */}
//       <ConsultationHeader consultation={consultation} identity={identity} />
      
//       {/* Main Content */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* Video Call Area */}
//         <div className="flex-1">
//           <Suspense 
//             fallback={
//               <div className="h-full flex items-center justify-center">
//                 <div className="text-center space-y-4">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                   <p>Loading video consultation...</p>
//                 </div>
//               </div>
//             }
//           >
//             <VideoCall
//               doctorName={consultation.doctor.name}
//               doctorSpecialty={consultation.doctor.specialty}
//               patientName={identity}
//               consultationId={id}
//             />
//           </Suspense>
//         </div>
        
//         {/* Sidebar */}
//         <ConsultationSidebar consultation={consultation} identity={identity} />
//       </div>
//     </div>
//   );
// }

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
                <h4 className="font-medium text-gray-900 text-[1.2vw]">Pre-made Rooms</h4>
              <CardTitle></CardTitle>     
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-medium text-blue-900">Quick Start</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Generate a random room name and join immediately
                </p>
              </div> */}

              {/* <Button 
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
              </Button> */}

              <div className="pt-4 border-t">
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