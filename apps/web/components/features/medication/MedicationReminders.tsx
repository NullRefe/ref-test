import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle, CheckCircle2, Clock, Pill } from 'lucide-react'
import { useEffect } from 'react'
import { useMedicationStore } from './stores/medication-store'

export function MedicationReminders() {
  const { 
    todayReminders, 
    getUpcomingReminders, 
    markReminderTaken, 
    generateTodayReminders,
    medications 
  } = useMedicationStore()
  const { toast } = useToast()

  useEffect(() => {
    // Generate reminders when component mounts
    generateTodayReminders()
    
    // Set up interval to regenerate reminders daily
    const interval = setInterval(() => {
      generateTodayReminders()
    }, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [medications])

  const handleMarkTaken = (medicationId: string, time: string, medicationName: string) => {
    markReminderTaken(medicationId, time)
    toast({
      title: "Medication Taken",
      description: `Marked ${medicationName} at ${time} as taken`,
    })
  }

  const getCurrentTime = () => {
    const now = new Date()
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  }

  const upcomingReminders = getUpcomingReminders()
  const currentTime = getCurrentTime()
  
  // Separate reminders into different categories
  const overdue = todayReminders.filter(reminder => 
    !reminder.taken && reminder.time < currentTime
  )
  
  const current = todayReminders.filter(reminder => {
    const reminderHour = parseInt(reminder.time.split(':')[0])
    const currentHour = new Date().getHours()
    return !reminder.taken && reminderHour === currentHour
  })
  
  const completed = todayReminders.filter(reminder => reminder.taken)

  if (todayReminders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Reminders Today</h3>
          <p className="text-muted-foreground">
            You don't have any medication reminders set for today.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overdue Reminders */}
      {overdue.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Overdue Reminders ({overdue.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdue.map((reminder) => (
              <div
                key={`${reminder.medicationId}-${reminder.time}`}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
              >
                <div className="flex items-center gap-3">
                  <Pill className="h-5 w-5 text-red-600" />
                  <div>
                    <h4 className="font-medium text-foreground">{reminder.medicationName}</h4>
                    <p className="text-sm text-red-600">Due at {reminder.time}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMarkTaken(reminder.medicationId, reminder.time, reminder.medicationName)}
                  className="border-red-300 text-red-600 hover:bg-red-600 hover:text-white"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Taken
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Current Hour Reminders */}
      {current.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Clock className="h-5 w-5" />
              Time to Take Medication ({current.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {current.map((reminder) => (
              <div
                key={`${reminder.medicationId}-${reminder.time}`}
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
              >
                <div className="flex items-center gap-3">
                  <Pill className="h-5 w-5 text-orange-600" />
                  <div>
                    <h4 className="font-medium text-foreground">{reminder.medicationName}</h4>
                    <p className="text-sm text-orange-600">{reminder.time}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleMarkTaken(reminder.medicationId, reminder.time, reminder.medicationName)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Take Now
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Reminders */}
      {upcomingReminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingReminders.map((reminder) => (
              <div
                key={`${reminder.medicationId}-${reminder.time}`}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <Pill className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{reminder.medicationName}</h4>
                  <p className="text-sm text-muted-foreground">{reminder.time}</p>
                </div>
                <Badge variant="outline">{reminder.time}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completed Today */}
      {completed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Completed Today ({completed.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completed.map((reminder) => (
              <div
                key={`${reminder.medicationId}-${reminder.time}`}
                className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-foreground">{reminder.medicationName}</h4>
                  <p className="text-sm text-green-600">Taken at {reminder.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Today's Progress</span>
            <span className="font-medium">
              {completed.length} of {todayReminders.length} medications taken
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: todayReminders.length > 0 
                  ? `${(completed.length / todayReminders.length) * 100}%` 
                  : '0%' 
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}