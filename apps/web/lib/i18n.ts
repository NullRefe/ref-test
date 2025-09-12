export interface Translation {
  // Common
  common: {
    welcome: string
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    continue: string
    back: string
    next: string
    submit: string
    search: string
    close: string
    yes: string
    no: string
  }

  // Authentication
  auth: {
    signIn: string
    signOut: string
    patient: string
    doctor: string
    phoneNumber: string
    email: string
    password: string
    preferredLanguage: string
    signInAsPatient: string
    signInAsDoctor: string
    needHelp: string
    newToHealthConnect: string
    registerNewAccount: string
  }

  // Dashboard
  dashboard: {
    welcome: string
    patientId: string
    quickActions: string
    accessHealthcareServices: string
    bookConsultation: string
    healthRecords: string
    findMedicine: string
    symptomChecker: string
    upcomingConsultations: string
    scheduledAppointments: string
    noUpcomingConsultations: string
    bookFirstConsultation: string
    joinCall: string
    healthSummary: string
    lastCheckup: string
    bloodPressure: string
    weight: string
    viewFullRecords: string
    recentActivity: string
    consultationCompleted: string
    prescriptionUpdated: string
  }

  // Health Records
  healthRecords: {
    title: string
    subtitle: string
    backToDashboard: string
    exportRecords: string
    online: string
    offlineMode: string
    overview: string
    consultations: string
    prescriptions: string
    testsReports: string
    currentVitalSigns: string
    lastUpdated: string
    recentMedicalRecords: string
    latestMedicalActivities: string
    patientInformation: string
    emergencyContact: string
    medicalAlerts: string
    allergies: string
    chronicConditions: string
    detailedNotes: string
    instructions: string
    results: string
  }

  // Pharmacy
  pharmacy: {
    title: string
    subtitle: string
    searchMedicine: string
    enterMedicineName: string
    searching: string
    quickSearch: string
    medicineDetails: string
    strength: string
    form: string
    manufacturer: string
    availableNearbyPharmacies: string
    realTimeAvailability: string
    inStock: string
    lowStock: string
    outOfStock: string
    closed: string
    directions: string
    call: string
    activePrescriptions: string
    findMedicinesFromPrescriptions: string
    prescribedBy: string
    findNearby: string
    updated: string
  }

  // Symptom Checker
  symptomChecker: {
    title: string
    subtitle: string
    aiPowered: string
    primarySymptom: string
    additionalDetails: string
    personalInformation: string
    assessmentResults: string
    importantDisclaimer: string
    disclaimerText: string
    mainSymptom: string
    describeSymptom: string
    howLongSymptom: string
    lessThanDay: string
    oneToDays: string
    fourToSevenDays: string
    moreThanWeek: string
    howSevere: string
    mild: string
    moderate: string
    severe: string
    additionalSymptoms: string
    selectAllThatApply: string
    personalInfo: string
    moreAccurateAssessment: string
    age: string
    gender: string
    male: string
    female: string
    other: string
    medicalHistory: string
    currentMedications: string
    analyzingSymptoms: string
    getAssessment: string
    assessmentComplete: string
    riskLevel: string
    possibleConditions: string
    basedOnSymptoms: string
    recommendations: string
    nextSteps: string
    callEmergencyServices: string
    bookConsultationDoctor: string
    saveAssessmentRecords: string
    startNewAssessment: string
  }

  // Video Call
  videoCall: {
    title: string
    connecting: string
    connected: string
    poorConnection: string
    disconnected: string
    callControls: string
    videoOn: string
    videoOff: string
    micOn: string
    micOff: string
    share: string
    chat: string
    endCall: string
    connectionQuality: string
    videoQuality: string
    audioQuality: string
    network: string
    stable: string
    good: string
    quickNotes: string
    addNote: string
  }

  // Booking
  booking: {
    title: string
    subtitle: string
    selectDoctor: string
    selectTime: string
    confirm: string
    availableDoctors: string
    videoCall: string
    phoneCall: string
    yearsExperience: string
    consultationFee: string
    selectDate: string
    confirmBooking: string
    reviewDetails: string
    date: string
    time: string
    confirmAndPay: string
    bookingConfirmed: string
    bookingSuccess: string
    appointmentDetails: string
    doctor: string
    type: string
    goToDashboard: string
    bookAnother: string
  }
}

export const translations: Record<string, Translation> = {
  en: {
    common: {
      welcome: "Welcome",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      continue: "Continue",
      back: "Back",
      next: "Next",
      submit: "Submit",
      search: "Search",
      close: "Close",
      yes: "Yes",
      no: "No",
    },
    auth: {
      signIn: "Sign In",
      signOut: "Sign Out",
      patient: "Patient",
      doctor: "Doctor",
      phoneNumber: "Phone Number",
      email: "Email",
      password: "Password",
      preferredLanguage: "Preferred Language",
      signInAsPatient: "Sign In as Patient",
      signInAsDoctor: "Sign In as Doctor",
      needHelp: "Need help signing in?",
      newToHealthConnect: "New to HealthConnect?",
      registerNewAccount: "Register New Account",
    },
    dashboard: {
      welcome: "Welcome",
      patientId: "Patient ID",
      quickActions: "Quick Actions",
      accessHealthcareServices: "Access your healthcare services",
      bookConsultation: "Book Consultation",
      healthRecords: "Health Records",
      findMedicine: "Find Medicine",
      symptomChecker: "Symptom Checker",
      upcomingConsultations: "Upcoming Consultations",
      scheduledAppointments: "Your scheduled appointments",
      noUpcomingConsultations: "No upcoming consultations",
      bookFirstConsultation: "Book Your First Consultation",
      joinCall: "Join Call",
      healthSummary: "Health Summary",
      lastCheckup: "Last Checkup",
      bloodPressure: "Blood Pressure",
      weight: "Weight",
      viewFullRecords: "View Full Records",
      recentActivity: "Recent Activity",
      consultationCompleted: "Consultation completed",
      prescriptionUpdated: "Prescription updated",
    },
    healthRecords: {
      title: "Health Records",
      subtitle: "Your complete medical history",
      backToDashboard: "Back to Dashboard",
      exportRecords: "Export Records",
      online: "Online",
      offlineMode: "Offline Mode",
      overview: "Overview",
      consultations: "Consultations",
      prescriptions: "Prescriptions",
      testsReports: "Tests & Reports",
      currentVitalSigns: "Current Vital Signs",
      lastUpdated: "Last updated",
      recentMedicalRecords: "Recent Medical Records",
      latestMedicalActivities: "Your latest medical activities",
      patientInformation: "Patient Information",
      emergencyContact: "Emergency Contact",
      medicalAlerts: "Medical Alerts",
      allergies: "Allergies",
      chronicConditions: "Chronic Conditions",
      detailedNotes: "Detailed Notes",
      instructions: "Instructions",
      results: "Results",
    },
    pharmacy: {
      title: "Medicine Finder",
      subtitle: "Find medicines at nearby pharmacies",
      searchMedicine: "Search Medicine",
      enterMedicineName: "Enter medicine name or generic name to find availability",
      searching: "Searching...",
      quickSearch: "Quick search",
      medicineDetails: "Medicine Details",
      strength: "Strength",
      form: "Form",
      manufacturer: "Manufacturer",
      availableNearbyPharmacies: "Available at Nearby Pharmacies",
      realTimeAvailability: "Real-time availability and pricing information",
      inStock: "In Stock",
      lowStock: "Low Stock",
      outOfStock: "Out of Stock",
      closed: "Closed",
      directions: "Directions",
      call: "Call",
      activePrescriptions: "Active Prescriptions",
      findMedicinesFromPrescriptions: "Find medicines from your recent prescriptions",
      prescribedBy: "Prescribed by",
      findNearby: "Find Nearby",
      updated: "Updated",
    },
    symptomChecker: {
      title: "AI Symptom Checker",
      subtitle: "Get preliminary health assessment",
      aiPowered: "AI Powered",
      primarySymptom: "Primary Symptom",
      additionalDetails: "Additional Details",
      personalInformation: "Personal Information",
      assessmentResults: "Assessment Results",
      importantDisclaimer: "Important Disclaimer",
      disclaimerText:
        "This AI symptom checker provides preliminary guidance only and is not a substitute for professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.",
      mainSymptom: "What is your main symptom?",
      describeSymptom: "Describe your primary concern or symptom",
      howLongSymptom: "How long have you had this symptom?",
      lessThanDay: "Less than a day",
      oneToDays: "1-3 days",
      fourToSevenDays: "4-7 days",
      moreThanWeek: "More than a week",
      howSevere: "How severe is this symptom?",
      mild: "Mild - Doesn't interfere with daily activities",
      moderate: "Moderate - Some interference with activities",
      severe: "Severe - Significantly affects daily life",
      additionalSymptoms: "Any additional symptoms?",
      selectAllThatApply: "Select any other symptoms you're experiencing",
      personalInfo: "Personal Information",
      moreAccurateAssessment: "Help us provide more accurate assessment",
      age: "Age",
      gender: "Gender",
      male: "Male",
      female: "Female",
      other: "Other",
      medicalHistory: "Medical History (Optional)",
      currentMedications: "Current Medications (Optional)",
      analyzingSymptoms: "Analyzing Symptoms...",
      getAssessment: "Get Assessment",
      assessmentComplete: "Assessment Complete",
      riskLevel: "RISK",
      possibleConditions: "Possible Conditions",
      basedOnSymptoms: "Based on your symptoms, these conditions are possible",
      recommendations: "Recommendations",
      nextSteps: "Next Steps",
      callEmergencyServices: "Call Emergency Services",
      bookConsultationDoctor: "Book Consultation with Doctor",
      saveAssessmentRecords: "Save Assessment to Health Records",
      startNewAssessment: "Start New Assessment",
    },
    videoCall: {
      title: "Video Consultation",
      connecting: "Connecting...",
      connected: "Connected",
      poorConnection: "Poor Connection",
      disconnected: "Disconnected",
      callControls: "Call Controls",
      videoOn: "Video On",
      videoOff: "Video Off",
      micOn: "Mic On",
      micOff: "Mic Off",
      share: "Share",
      chat: "Chat",
      endCall: "End Call",
      connectionQuality: "Connection Quality",
      videoQuality: "Video Quality",
      audioQuality: "Audio Quality",
      network: "Network",
      stable: "Stable",
      good: "Good",
      quickNotes: "Quick Notes",
      addNote: "Add Note",
    },
    booking: {
      title: "Book Consultation",
      subtitle: "Schedule an appointment with our qualified doctors",
      selectDoctor: "Select Doctor",
      selectTime: "Select Time",
      confirm: "Confirm",
      availableDoctors: "Available Doctors",
      videoCall: "Video Call",
      phoneCall: "Phone Call",
      yearsExperience: "years experience",
      consultationFee: "Consultation Fee",
      selectDate: "Select Date",
      confirmBooking: "Confirm Booking",
      reviewDetails: "Please review your appointment details",
      date: "Date",
      time: "Time",
      confirmAndPay: "Confirm & Pay",
      bookingConfirmed: "Booking Confirmed!",
      bookingSuccess: "Your consultation has been successfully booked",
      appointmentDetails: "Appointment Details",
      doctor: "Doctor",
      type: "Type",
      goToDashboard: "Go to Dashboard",
      bookAnother: "Book Another",
    },
  },
  hi: {
    common: {
      welcome: "स्वागत है",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफलता",
      cancel: "रद्द करें",
      save: "सहेजें",
      continue: "जारी रखें",
      back: "वापस",
      next: "अगला",
      submit: "जमा करें",
      search: "खोजें",
      close: "बंद करें",
      yes: "हाँ",
      no: "नहीं",
    },
    auth: {
      signIn: "साइन इन करें",
      signOut: "साइन आउट करें",
      patient: "मरीज़",
      doctor: "डॉक्टर",
      phoneNumber: "फोन नंबर",
      email: "ईमेल",
      password: "पासवर्ड",
      preferredLanguage: "पसंदीदा भाषा",
      signInAsPatient: "मरीज़ के रूप में साइन इन करें",
      signInAsDoctor: "डॉक्टर के रूप में साइन इन करें",
      needHelp: "साइन इन करने में सहायता चाहिए?",
      newToHealthConnect: "HealthConnect पर नए हैं?",
      registerNewAccount: "नया खाता बनाएं",
    },
    dashboard: {
      welcome: "स्वागत है",
      patientId: "मरीज़ आईडी",
      quickActions: "त्वरित कार्य",
      accessHealthcareServices: "अपनी स्वास्थ्य सेवाओं तक पहुंचें",
      bookConsultation: "परामर्श बुक करें",
      healthRecords: "स्वास्थ्य रिकॉर्ड",
      findMedicine: "दवा खोजें",
      symptomChecker: "लक्षण जांचकर्ता",
      upcomingConsultations: "आगामी परामर्श",
      scheduledAppointments: "आपकी निर्धारित अपॉइंटमेंट्स",
      noUpcomingConsultations: "कोई आगामी परामर्श नहीं",
      bookFirstConsultation: "अपना पहला परामर्श बुक करें",
      joinCall: "कॉल में शामिल हों",
      healthSummary: "स्वास्थ्य सारांश",
      lastCheckup: "अंतिम जांच",
      bloodPressure: "रक्तचाप",
      weight: "वजन",
      viewFullRecords: "पूरे रिकॉर्ड देखें",
      recentActivity: "हाल की गतिविधि",
      consultationCompleted: "परामर्श पूरा हुआ",
      prescriptionUpdated: "नुस्खा अपडेट किया गया",
    },
    healthRecords: {
      title: "स्वास्थ्य रिकॉर्ड",
      subtitle: "आपका संपूर्ण चिकित्सा इतिहास",
      backToDashboard: "डैशबोर्ड पर वापस जाएं",
      exportRecords: "रिकॉर्ड निर्यात करें",
      online: "ऑनलाइन",
      offlineMode: "ऑफलाइन मोड",
      overview: "अवलोकन",
      consultations: "परामर्श",
      prescriptions: "नुस्खे",
      testsReports: "परीक्षण और रिपोर्ट",
      currentVitalSigns: "वर्तमान महत्वपूर्ण संकेत",
      lastUpdated: "अंतिम बार अपडेट किया गया",
      recentMedicalRecords: "हाल के चिकित्सा रिकॉर्ड",
      latestMedicalActivities: "आपकी नवीनतम चिकित्सा गतिविधियां",
      patientInformation: "मरीज़ की जानकारी",
      emergencyContact: "आपातकालीन संपर्क",
      medicalAlerts: "चिकित्सा अलर्ट",
      allergies: "एलर्जी",
      chronicConditions: "पुरानी बीमारियां",
      detailedNotes: "विस्तृत नोट्स",
      instructions: "निर्देश",
      results: "परिणाम",
    },
    pharmacy: {
      title: "दवा खोजकर्ता",
      subtitle: "नजदीकी फार्मेसियों में दवाएं खोजें",
      searchMedicine: "दवा खोजें",
      enterMedicineName: "उपलब्धता जानने के लिए दवा का नाम या जेनेरिक नाम दर्ज करें",
      searching: "खोज रहे हैं...",
      quickSearch: "त्वरित खोज",
      medicineDetails: "दवा विवरण",
      strength: "शक्ति",
      form: "रूप",
      manufacturer: "निर्माता",
      availableNearbyPharmacies: "नजदीकी फार्मेसियों में उपलब्ध",
      realTimeAvailability: "वास्तविक समय उपलब्धता और मूल्य जानकारी",
      inStock: "स्टॉक में",
      lowStock: "कम स्टॉक",
      outOfStock: "स्टॉक में नहीं",
      closed: "बंद",
      directions: "दिशा-निर्देश",
      call: "कॉल करें",
      activePrescriptions: "सक्रिय नुस्खे",
      findMedicinesFromPrescriptions: "अपने हाल के नुस्खों से दवाएं खोजें",
      prescribedBy: "द्वारा निर्धारित",
      findNearby: "नजदीक खोजें",
      updated: "अपडेट किया गया",
    },
    symptomChecker: {
      title: "AI लक्षण जांचकर्ता",
      subtitle: "प्रारंभिक स्वास्थ्य मूल्यांकन प्राप्त करें",
      aiPowered: "AI संचालित",
      primarySymptom: "मुख्य लक्षण",
      additionalDetails: "अतिरिक्त विवरण",
      personalInformation: "व्यक्तिगत जानकारी",
      assessmentResults: "मूल्यांकन परिणाम",
      importantDisclaimer: "महत्वपूर्ण अस्वीकरण",
      disclaimerText:
        "यह AI लक्षण जांचकर्ता केवल प्रारंभिक मार्गदर्शन प्रदान करता है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है। उचित निदान और उपचार के लिए हमेशा स्वास्थ्य सेवा प्रदाता से सलाह लें।",
      mainSymptom: "आपका मुख्य लक्षण क्या है?",
      describeSymptom: "अपनी मुख्य चिंता या लक्षण का वर्णन करें",
      howLongSymptom: "आपको यह लक्षण कितने समय से है?",
      lessThanDay: "एक दिन से कम",
      oneToDays: "1-3 दिन",
      fourToSevenDays: "4-7 दिन",
      moreThanWeek: "एक सप्ताह से अधिक",
      howSevere: "यह लक्षण कितना गंभीर है?",
      mild: "हल्का - दैनिक गतिविधियों में हस्तक्षेप नहीं करता",
      moderate: "मध्यम - गतिविधियों में कुछ हस्तक्षेप",
      severe: "गंभीर - दैनिक जीवन को काफी प्रभावित करता है",
      additionalSymptoms: "कोई अतिरिक्त लक्षण?",
      selectAllThatApply: "आप जो भी अन्य लक्षण अनुभव कर रहे हैं उन्हें चुनें",
      personalInfo: "व्यक्तिगत जानकारी",
      moreAccurateAssessment: "अधिक सटीक मूल्यांकन प्रदान करने में हमारी सहायता करें",
      age: "उम्र",
      gender: "लिंग",
      male: "पुरुष",
      female: "महिला",
      other: "अन्य",
      medicalHistory: "चिकित्सा इतिहास (वैकल्पिक)",
      currentMedications: "वर्तमान दवाएं (वैकल्पिक)",
      analyzingSymptoms: "लक्षणों का विश्लेषण कर रहे हैं...",
      getAssessment: "मूल्यांकन प्राप्त करें",
      assessmentComplete: "मूल्यांकन पूर्ण",
      riskLevel: "जोखिम",
      possibleConditions: "संभावित स्थितियां",
      basedOnSymptoms: "आपके लक्षणों के आधार पर, ये स्थितियां संभव हैं",
      recommendations: "सिफारिशें",
      nextSteps: "अगले कदਮ",
      callEmergencyServices: "आपातकालीन सेवाओं को कॉल करें",
      bookConsultationDoctor: "डॉक्टर के साथ परामर्श बुक करें",
      saveAssessmentRecords: "स्वास्थ्य रिकॉर्ड में मूल्यांकन सहेजें",
      startNewAssessment: "नया मूल्यांकन शुरू करें",
    },
    videoCall: {
      title: "वीडियो परामर्श",
      connecting: "कनेक्ट हो रहा है...",
      connected: "कनेक्ट हो गया",
      poorConnection: "खराब कनेक्शन",
      disconnected: "डिस्कनेक्ट हो गया",
      callControls: "कॉल नियंत्रण",
      videoOn: "वीडियो चालू",
      videoOff: "वीडियो बंद",
      micOn: "माइक चालू",
      micOff: "माइक बंद",
      share: "साझा करें",
      chat: "चैट",
      endCall: "कॉल समाप्त करें",
      connectionQuality: "कनेक्शन गुणवत्ता",
      videoQuality: "वीडियो गुणवत्ता",
      audioQuality: "ऑडियो गुणवत्ता",
      network: "नेटवर्क",
      stable: "स्थिर",
      good: "अच्छा",
      quickNotes: "त्वरित नोट्स",
      addNote: "नोट जोड़ें",
    },
    booking: {
      title: "परामर्श बुक करें",
      subtitle: "हमारे योग्य डॉक्टरों के साथ अपॉइंटमेंट शेड्यूल करें",
      selectDoctor: "डॉक्टर चुनें",
      selectTime: "समय चुनें",
      confirm: "पुष्टि करें",
      availableDoctors: "उपलब्ध डॉक्टर",
      videoCall: "वीडियो कॉल",
      phoneCall: "फोन कॉल",
      yearsExperience: "साल का अनुभव",
      consultationFee: "परामर्श शुल्क",
      selectDate: "तारीख चुनें",
      confirmBooking: "बुकिंग की पुष्टि करें",
      reviewDetails: "कृपया अपनी अपॉइंटमेंट का विवरण देखें",
      date: "तारीख",
      time: "समय",
      confirmAndPay: "पुष्टि करें और भुगतान करें",
      bookingConfirmed: "बुकिंग की पुष्टि हो गई!",
      bookingSuccess: "आपका परामर्श सफलतापूर्वक बुक हो गया है",
      appointmentDetails: "अपॉइंटमेंट विवरण",
      doctor: "डॉक्टर",
      type: "प्रकार",
      goToDashboard: "डैशबोर्ड पर जाएं",
      bookAnother: "दूसरा बुक करें",
    },
  },
  pa: {
    common: {
      welcome: "ਜੀ ਆਇਆਂ ਨੂੰ",
      loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
      error: "ਗਲਤੀ",
      success: "ਸਫਲਤਾ",
      cancel: "ਰੱਦ ਕਰੋ",
      save: "ਸੇਵ ਕਰੋ",
      continue: "ਜਾਰੀ ਰੱਖੋ",
      back: "ਵਾਪਸ",
      next: "ਅਗਲਾ",
      submit: "ਜਮ੍ਹਾਂ ਕਰੋ",
      search: "ਖੋਜੋ",
      close: "ਬੰਦ ਕਰੋ",
      yes: "ਹਾਂ",
      no: "ਨਹੀਂ",
    },
    auth: {
      signIn: "ਸਾਈਨ ਇਨ ਕਰੋ",
      signOut: "ਸਾਈਨ ਆਊਟ ਕਰੋ",
      patient: "ਮਰੀਜ਼",
      doctor: "ਡਾਕਟਰ",
      phoneNumber: "ਫੋਨ ਨੰਬਰ",
      email: "ਈਮੇਲ",
      password: "ਪਾਸਵਰਡ",
      preferredLanguage: "ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ",
      signInAsPatient: "ਮਰੀਜ਼ ਵਜੋਂ ਸਾਈਨ ਇਨ ਕਰੋ",
      signInAsDoctor: "ਡਾਕਟਰ ਵਜੋਂ ਸਾਈਨ ਇਨ ਕਰੋ",
      needHelp: "ਸਾਈਨ ਇਨ ਕਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
      newToHealthConnect: "HealthConnect ਤੇ ਨਵੇਂ ਹੋ?",
      registerNewAccount: "ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ",
    },
    dashboard: {
      welcome: "ਜੀ ਆਇਆਂ ਨੂੰ",
      patientId: "ਮਰੀਜ਼ ਆਈਡੀ",
      quickActions: "ਤੇਜ਼ ਕਾਰਵਾਈਆਂ",
      accessHealthcareServices: "ਆਪਣੀਆਂ ਸਿਹਤ ਸੇਵਾਵਾਂ ਤੱਕ ਪਹੁੰਚ ਕਰੋ",
      bookConsultation: "ਸਲਾਹ ਬੁੱਕ ਕਰੋ",
      healthRecords: "ਸਿਹਤ ਰਿਕਾਰਡ",
      findMedicine: "ਦਵਾਈ ਲੱਭੋ",
      symptomChecker: "ਲੱਛਣ ਜਾਂਚਕਰਤਾ",
      upcomingConsultations: "ਆਉਣ ਵਾਲੀਆਂ ਸਲਾਹਾਂ",
      scheduledAppointments: "ਤੁਹਾਡੀਆਂ ਨਿਰਧਾਰਿਤ ਮੁਲਾਕਾਤਾਂ",
      noUpcomingConsultations: "ਕੋਈ ਆਉਣ ਵਾਲੀ ਸਲਾਹ ਨਹੀਂ",
      bookFirstConsultation: "ਆਪਣੀ ਪਹਿਲੀ ਸਲਾਹ ਬੁੱਕ ਕਰੋ",
      joinCall: "ਕਾਲ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ",
      healthSummary: "ਸਿਹਤ ਸਾਰ",
      lastCheckup: "ਆਖਰੀ ਜਾਂਚ",
      bloodPressure: "ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ",
      weight: "ਭਾਰ",
      viewFullRecords: "ਪੂਰੇ ਰਿਕਾਰਡ ਵੇਖੋ",
      recentActivity: "ਹਾਲ ਦੀ ਗਤੀਵਿਧੀ",
      consultationCompleted: "ਸਲਾਹ ਪੂਰੀ ਹੋਈ",
      prescriptionUpdated: "ਨੁਸਖਾ ਅਪਡੇਟ ਕੀਤਾ ਗਿਆ",
    },
    healthRecords: {
      title: "ਸਿਹਤ ਰਿਕਾਰਡ",
      subtitle: "ਤੁਹਾਡਾ ਪੂਰਾ ਮੈਡੀਕਲ ਇਤਿਹਾਸ",
      backToDashboard: "ਡੈਸ਼ਬੋਰਡ ਤੇ ਵਾਪਸ ਜਾਓ",
      exportRecords: "ਰਿਕਾਰਡ ਐਕਸਪੋਰਟ ਕਰੋ",
      online: "ਔਨਲਾਈਨ",
      offlineMode: "ਔਫਲਾਈਨ ਮੋਡ",
      overview: "ਸਮੀਖਿਆ",
      consultations: "ਸਲਾਹਾਂ",
      prescriptions: "ਨੁਸਖੇ",
      testsReports: "ਟੈਸਟ ਅਤੇ ਰਿਪੋਰਟਾਂ",
      currentVitalSigns: "ਮੌਜੂਦਾ ਮਹੱਤਵਪੂਰਨ ਸੰਕੇਤ",
      lastUpdated: "ਆਖਰੀ ਵਾਰ ਅਪਡੇਟ ਕੀਤਾ ਗਿਆ",
      recentMedicalRecords: "ਹਾਲ ਦੇ ਮੈਡੀਕਲ ਰਿਕਾਰਡ",
      latestMedicalActivities: "ਤੁਹਾਡੀਆਂ ਨਵੀਨਤਮ ਮੈਡੀਕਲ ਗਤੀਵਿਧੀਆਂ",
      patientInformation: "ਮਰੀਜ਼ ਦੀ ਜਾਣਕਾਰੀ",
      emergencyContact: "ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ",
      medicalAlerts: "ਮੈਡੀਕਲ ਅਲਰਟ",
      allergies: "ਐਲਰਜੀ",
      chronicConditions: "ਪੁਰਾਣੀਆਂ ਬਿਮਾਰੀਆਂ",
      detailedNotes: "ਵਿਸਤ੍ਰਿਤ ਨੋਟਸ",
      instructions: "ਹਦਾਇਤਾਂ",
      results: "ਨਤੀਜੇ",
    },
    pharmacy: {
      title: "ਦਵਾਈ ਖੋਜਕਰਤਾ",
      subtitle: "ਨੇੜਲੀਆਂ ਫਾਰਮੇਸੀਆਂ ਵਿੱਚ ਦਵਾਈਆਂ ਲੱਭੋ",
      searchMedicine: "ਦਵਾਈ ਖੋਜੋ",
      enterMedicineName: "ਉਪਲਬਧਤਾ ਜਾਣਨ ਲਈ ਦਵਾਈ ਦਾ ਨਾਮ ਜਾਂ ਜੈਨਰਿਕ ਨਾਮ ਦਰਜ ਕਰੋ",
      searching: "ਖੋਜ ਰਹੇ ਹਾਂ...",
      quickSearch: "ਤੇਜ਼ ਖੋਜ",
      medicineDetails: "ਦਵਾਈ ਵੇਰਵਾ",
      strength: "ਤਾਕਤ",
      form: "ਰੂਪ",
      manufacturer: "ਨਿਰਮਾਤਾ",
      availableNearbyPharmacies: "ਨੇੜਲੀਆਂ ਫਾਰਮੇਸੀਆਂ ਵਿੱਚ ਉਪਲਬਧ",
      realTimeAvailability: "ਰੀਅਲ-ਟਾਈਮ ਉਪਲਬਧਤਾ ਅਤੇ ਕੀਮਤ ਜਾਣਕਾਰੀ",
      inStock: "ਸਟਾਕ ਵਿੱਚ",
      lowStock: "ਘੱਟ ਸਟਾਕ",
      outOfStock: "ਸਟਾਕ ਵਿੱਚ ਨਹੀਂ",
      closed: "ਬੰਦ",
      directions: "ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼",
      call: "ਕਾਲ ਕਰੋ",
      activePrescriptions: "ਸਰਗਰਮ ਨੁਸਖੇ",
      findMedicinesFromPrescriptions: "ਆਪਣੇ ਹਾਲ ਦੇ ਨੁਸਖਿਆਂ ਤੋਂ ਦਵਾਈਆਂ ਲੱਭੋ",
      prescribedBy: "ਦੁਆਰਾ ਨਿਰਧਾਰਿਤ",
      findNearby: "ਨੇੜੇ ਲੱਭੋ",
      updated: "ਅਪਡੇਟ ਕੀਤਾ ਗਿਆ",
    },
    symptomChecker: {
      title: "AI ਲੱਛਣ ਜਾਂਚਕਰਤਾ",
      subtitle: "ਸ਼ੁਰੂਆਤੀ ਸਿਹਤ ਮੁਲਾਂਕਣ ਪ੍ਰਾਪਤ ਕਰੋ",
      aiPowered: "AI ਸੰਚਾਲਿਤ",
      primarySymptom: "ਮੁੱਖ ਲੱਛਣ",
      additionalDetails: "ਵਾਧੂ ਵੇਰਵੇ",
      personalInformation: "ਨਿੱਜੀ ਜਾਣਕਾਰੀ",
      assessmentResults: "ਮੁਲਾਂਕਣ ਨਤੀਜੇ",
      importantDisclaimer: "ਮਹੱਤਵਪੂਰਨ ਬੇਦਾਅਵਾ",
      disclaimerText:
        "ਇਹ AI ਲੱਛਣ ਜਾਂਚਕਰਤਾ ਸਿਰਫ਼ ਸ਼ੁਰੂਆਤੀ ਮਾਰਗਦਰਸ਼ਨ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ ਅਤੇ ਪੇਸ਼ੇਵਰ ਮੈਡੀਕਲ ਸਲਾਹ ਦਾ ਵਿਕਲਪ ਨਹੀਂ ਹੈ। ਸਹੀ ਨਿਦਾਨ ਅਤੇ ਇਲਾਜ ਲਈ ਹਮੇਸ਼ਾ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨਾਲ ਸਲਾਹ ਕਰੋ।",
      mainSymptom: "ਤੁਹਾਡਾ ਮੁੱਖ ਲੱਛਣ ਕੀ ਹੈ?",
      describeSymptom: "ਆਪਣੀ ਮੁੱਖ ਚਿੰਤਾ ਜਾਂ ਲੱਛਣ ਦਾ ਵਰਣਨ ਕਰੋ",
      howLongSymptom: "ਤੁਹਾਨੂੰ ਇਹ ਲੱਛਣ ਕਿੰਨੇ ਸਮੇਂ ਤੋਂ ਹੈ?",
      lessThanDay: "ਇੱਕ ਦਿਨ ਤੋਂ ਘੱਟ",
      oneToDays: "1-3 ਦਿਨ",
      fourToSevenDays: "4-7 ਦਿਨ",
      moreThanWeek: "ਇੱਕ ਹਫ਼ਤੇ ਤੋਂ ਜ਼ਿਆਦਾ",
      howSevere: "ਇਹ ਲੱਛਣ ਕਿੰਨਾ ਗੰਭੀਰ ਹੈ?",
      mild: "ਹਲਕਾ - ਰੋਜ਼ਾਨਾ ਗਤੀਵਿਧੀਆਂ ਵਿੱਚ ਦਖਲ ਨਹੀਂ ਦਿੰਦਾ",
      moderate: "ਮੱਧਮ - ਗਤੀਵਿਧੀਆਂ ਵਿੱਚ ਕੁਝ ਦਖਲ",
      severe: "ਗੰਭੀਰ - ਰੋਜ਼ਾਨਾ ਜ਼ਿੰਦਗੀ ਨੂੰ ਕਾਫ਼ੀ ਪ੍ਰਭਾਵਿਤ ਕਰਦਾ ਹੈ",
      additionalSymptoms: "ਕੋਈ ਵਾਧੂ ਲੱਛਣ?",
      selectAllThatApply: "ਤੁਸੀਂ ਜੋ ਵੀ ਹੋਰ ਲੱਛਣ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ ਉਨ੍ਹਾਂ ਨੂੰ ਚੁਣੋ",
      personalInfo: "ਨਿੱਜੀ ਜਾਣਕਾਰੀ",
      moreAccurateAssessment: "ਵਧੇਰੇ ਸਟੀਕ ਮੁਲਾਂਕਣ ਪ੍ਰਦਾਨ ਕਰਨ ਵਿੱਚ ਸਾਡੀ ਮਦਦ ਕਰੋ",
      age: "ਉਮਰ",
      gender: "ਲਿੰਗ",
      male: "ਮਰਦ",
      female: "ਔਰਤ",
      other: "ਹੋਰ",
      medicalHistory: "ਮੈਡੀਕਲ ਇਤਿਹਾਸ (ਵਿਕਲਪਿਕ)",
      currentMedications: "ਮੌਜੂਦਾ ਦਵਾਈਆਂ (ਵਿਕਲਪਿਕ)",
      analyzingSymptoms: "ਲੱਛਣਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਹੇ ਹਾਂ...",
      getAssessment: "ਮੁਲਾਂਕਣ ਪ੍ਰਾਪਤ ਕਰੋ",
      assessmentComplete: "ਮੁਲਾਂਕਣ ਪੂਰਾ",
      riskLevel: "ਜੋਖਮ",
      possibleConditions: "ਸੰਭਾਵਿਤ ਸਥਿਤੀਆਂ",
      basedOnSymptoms: "ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਦੇ ਆਧਾਰ ਤੇ, ਇਹ ਸਥਿਤੀਆਂ ਸੰਭਵ ਹਨ",
      recommendations: "ਸਿਫ਼ਾਰਸ਼ਾਂ",
      nextSteps: "ਅਗਲੇ ਕਦਮ",
      callEmergencyServices: "ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨੂੰ ਕਾਲ ਕਰੋ",
      bookConsultationDoctor: "ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਬੁੱਕ ਕਰੋ",
      saveAssessmentRecords: "ਸਿਹਤ ਰਿਕਾਰਡ ਵਿੱਚ ਮੁਲਾਂਕਣ ਸੇਵ ਕਰੋ",
      startNewAssessment: "ਨਵਾਂ ਮੁਲਾਂਕਣ ਸ਼ੁਰੂ ਕਰੋ",
    },
    videoCall: {
      title: "ਵੀਡੀਓ ਸਲਾਹ",
      connecting: "ਕਨੈਕਟ ਹੋ ਰਿਹਾ ਹੈ...",
      connected: "ਕਨੈਕਟ ਹੋ ਗਿਆ",
      poorConnection: "ਮਾੜਾ ਕਨੈਕਸ਼ਨ",
      disconnected: "ਡਿਸਕਨੈਕਟ ਹੋ ਗਿਆ",
      callControls: "ਕਾਲ ਕੰਟਰੋਲ",
      videoOn: "ਵੀਡੀਓ ਚਾਲੂ",
      videoOff: "ਵੀਡੀਓ ਬੰਦ",
      micOn: "ਮਾਈਕ ਚਾਲੂ",
      micOff: "ਮਾਈਕ ਬੰਦ",
      share: "ਸਾਂਝਾ ਕਰੋ",
      chat: "ਚੈਟ",
      endCall: "ਕਾਲ ਖਤਮ ਕਰੋ",
      connectionQuality: "ਕਨੈਕਸ਼ਨ ਗੁਣਵੱਤਾ",
      videoQuality: "ਵੀਡੀਓ ਗੁਣਵੱਤਾ",
      audioQuality: "ਆਡੀਓ ਗੁਣਵੱਤਾ",
      network: "ਨੈੱਟਵਰਕ",
      stable: "ਸਥਿਰ",
      good: "ਚੰਗਾ",
      quickNotes: "ਤੇਜ਼ ਨੋਟਸ",
      addNote: "ਨੋਟ ਜੋੜੋ",
    },
    booking: {
      title: "ਸਲਾਹ ਬੁੱਕ ਕਰੋ",
      subtitle: "ਸਾਡੇ ਯੋਗ ਡਾਕਟਰਾਂ ਨਾਲ ਮੁਲਾਕਾਤ ਨਿਰਧਾਰਿਤ ਕਰੋ",
      selectDoctor: "ਡਾਕਟਰ ਚੁਣੋ",
      selectTime: "ਸਮਾਂ ਚੁਣੋ",
      confirm: "ਪੁਸ਼ਟੀ ਕਰੋ",
      availableDoctors: "ਉਪਲਬਧ ਡਾਕਟਰ",
      videoCall: "ਵੀਡੀਓ ਕਾਲ",
      phoneCall: "ਫੋਨ ਕਾਲ",
      yearsExperience: "ਸਾਲ ਦਾ ਤਜਰਬਾ",
      consultationFee: "ਸਲਾਹ ਫੀਸ",
      selectDate: "ਤਾਰੀਖ ਚੁਣੋ",
      confirmBooking: "ਬੁਕਿੰਗ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
      reviewDetails: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਮੁਲਾਕਾਤ ਦੇ ਵੇਰਵੇ ਦੇਖੋ",
      date: "ਤਾਰੀਖ",
      time: "ਸਮਾਂ",
      confirmAndPay: "ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਭੁਗਤਾਨ ਕਰੋ",
      bookingConfirmed: "ਬੁਕਿੰਗ ਦੀ ਪੁਸ਼ਟੀ ਹੋ ਗਈ!",
      bookingSuccess: "ਤੁਹਾਡੀ ਸਲਾਹ ਸਫਲਤਾਪੂਰਵਕ ਬੁੱਕ ਹੋ ਗਈ ਹੈ",
      appointmentDetails: "ਮੁਲਾਕਾਤ ਵੇਰਵੇ",
      doctor: "ਡਾਕਟਰ",
      type: "ਕਿਸਮ",
      goToDashboard: "ਡੈਸ਼ਬੋਰਡ ਤੇ ਜਾਓ",
      bookAnother: "ਹੋਰ ਬੁੱਕ ਕਰੋ",
    },
  },
}

export type Language = keyof typeof translations
export const supportedLanguages: Language[] = ["en", "hi", "pa"]
export const languageNames: Record<Language, string> = {
  en: "English",
  hi: "हिंदी (Hindi)",
  pa: "ਪੰਜਾਬੀ (Punjabi)",
}
