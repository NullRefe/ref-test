import { VideoCall } from "@/components/video-call"

interface ConsultationPageProps {
  params: {
    id: string
  }
}

export default function ConsultationPage({ params }: ConsultationPageProps) {
  // In a real app, you'd fetch consultation details based on the ID
  return (
    <VideoCall
      doctorName="Dr. Priya Sharma"
      doctorSpecialty="General Medicine"
      patientName="Ramesh Kumar"
      consultationId={params.id}
    />
  )
}
