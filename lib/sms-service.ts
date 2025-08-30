// SMS Service for sending emergency alerts
export interface Contact {
  id: string
  name: string
  phone: string
  role: "Emergency Response" | "Local Authority" | "Resident" | "NGO"
  priority: "High" | "Medium" | "Low"
  language: "English" | "Hindi" | "Tamil" | "Telugu" | "Malayalam" | "Gujarati" | "Marathi" | "Odia" | "Kannada"
}

export interface SMSMessage {
  to: string[]
  message: string
  language: string
  alertType: "flood" | "cyclone" | "tsunami" | "earthquake"
  severity: "Critical" | "High" | "Medium" | "Low"
}

// Mock emergency contacts database
const emergencyContacts: Contact[] = [
  {
    id: "1",
    name: "Mumbai Emergency Response",
    phone: "+91-9876543210",
    role: "Emergency Response",
    priority: "High",
    language: "English"
  },
  {
    id: "2", 
    name: "Chennai Disaster Management",
    phone: "+91-9876543211",
    role: "Local Authority",
    priority: "High",
    language: "Tamil"
  },
  {
    id: "3",
    name: "Kochi Coast Guard",
    phone: "+91-9876543212", 
    role: "Emergency Response",
    priority: "High",
    language: "Malayalam"
  },
  {
    id: "4",
    name: "Mumbai Residents Group",
    phone: "+91-9876543213",
    role: "Resident",
    priority: "Medium",
    language: "Hindi"
  },
  {
    id: "5",
    name: "Chennai NGO Network",
    phone: "+91-9876543214",
    role: "NGO",
    priority: "Medium", 
    language: "English"
  }
]

// Message templates in different languages
const messageTemplates = {
  flood: {
    English: "🚨 FLOOD ALERT: {location} - {severity} flooding detected. Water level: {waterLevel}m. {evacuation}. Stay safe!",
    Hindi: "🚨 बाढ़ चेतावनी: {location} - {severity} बाढ़ का पता चला। पानी का स्तर: {waterLevel}मी। {evacuation}। सुरक्षित रहें!",
    Tamil: "🚨 வெள்ள எச்சரிக்கை: {location} - {severity} வெள்ளம் கண்டறியப்பட்டது। நீர் மட்டம்: {waterLevel}மீ। {evacuation}। பாதுகாப்பாக இருங்கள்!",
    Telugu: "🚨 వరద హెచ్చరిక: {location} - {severity} వరదలు గుర్తించబడ్డాయి। నీటి మట్టం: {waterLevel}మీ। {evacuation}। సురక్షితంగా ఉండండి!",
    Malayalam: "🚨 വെള്ളപ്പൊക്ക മുന്നറിയിപ്പ്: {location} - {severity} വെള്ളപ്പൊക്കം കണ്ടെത്തി। ജലനിരപ്പ്: {waterLevel}മീ। {evacuation}। സുരക്ഷിതമായി നിലകൊള്ളുക!",
    Gujarati: "🚨 પૂર ચેતવણી: {location} - {severity} પૂર મળ્યું છે। પાણીનું સ્તર: {waterLevel}મી। {evacuation}। સુરક્ષિત રહો!",
    Marathi: "🚨 पूर चेतावणी: {location} - {severity} पूर आढळला। पाण्याची पातळी: {waterLevel}मी। {evacuation}। सुरक्षित राहा!",
    Odia: "🚨 ବନ୍ୟା ଚେତାବନୀ: {location} - {severity} ବନ୍ୟା ଚିହ୍ନଟ ହୋଇଛି। ଜଳ ସ୍ତର: {waterLevel}ମି। {evacuation}। ସୁରକ୍ଷିତ ରୁହନ୍ତୁ!",
    Kannada: "🚨 ಪ್ರವಾಹ ಎಚ್ಚರಿಕೆ: {location} - {severity} ಪ್ರವಾಹ ಪತ್ತೆಯಾಗಿದೆ। ನೀರಿನ ಮಟ್ಟ: {waterLevel}ಮೀ। {evacuation}। ಸುರಕ್ಷಿತವಾಗಿರಿ!"
  }
}

const evacuationMessages = {
  Required: {
    English: "IMMEDIATE EVACUATION REQUIRED",
    Hindi: "तत्काल निकासी आवश्यक",
    Tamil: "உடனடி வெளியேற்றம் தேவை",
    Telugu: "తక్షణ తరలింపు అవసరం",
    Malayalam: "ഉടനടി ഒഴിപ്പിക്കൽ ആവശ്യം",
    Gujarati: "તાત્કાલિક સ્થળાંતર જરૂરી",
    Marathi: "तात्काळ स्थलांतर आवश्यक",
    Odia: "ତତ୍କାଳ ସ୍ଥାନାନ୍ତର ଆବଶ୍ୟକ",
    Kannada: "ತಕ್ಷಣದ ಸ್ಥಳಾಂತರ ಅಗತ್ಯ"
  },
  Recommended: {
    English: "Evacuation recommended",
    Hindi: "निकासी की सिफारिश",
    Tamil: "வெளியேற்றம் பரிந்துரைக்கப்படுகிறது",
    Telugu: "తరలింపు సిఫార్సు చేయబడింది",
    Malayalam: "ഒഴിപ്പിക്കൽ ശുപാർശ ചെയ്യുന്നു",
    Gujarati: "સ્થળાંતરની ભલામણ",
    Marathi: "स्थलांतराची शिफारस",
    Odia: "ସ୍ଥାନାନ୍ତରର ସୁପାରିଶ",
    Kannada: "ಸ್ಥಳಾಂತರದ ಶಿಫಾರಸು"
  },
  Monitor: {
    English: "Monitor situation closely",
    Hindi: "स्थिति पर बारीकी से नजर रखें",
    Tamil: "நிலைமையை நெருக்கமாக கண்காணிக்கவும்",
    Telugu: "పరిస్థితిని దగ్గరగా పర్యవేక్షించండి",
    Malayalam: "സാഹചര്യം സൂക്ഷ്മമായി നിരീക്ഷിക്കുക",
    Gujarati: "પરિસ્થિતિને નજીકથી મોનિટર કરો",
    Marathi: "परिस्थितीवर बारकाईने लक्ष ठेवा",
    Odia: "ପରିସ୍ଥିତିକୁ ଘନିଷ୍ଠ ଭାବରେ ନଜର ରଖନ୍ତୁ",
    Kannada: "ಪರಿಸ್ಥಿತಿಯನ್ನು ನಿಕಟವಾಗಿ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ"
  }
}

export class SMSService {
  private static instance: SMSService
  private apiKey: string = process.env.NEXT_PUBLIC_SMS_API_KEY || ""
  private apiUrl: string = "https://api.twilio.com/2010-04-01/Accounts" // Example with Twilio

  static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService()
    }
    return SMSService.instance
  }

  // Get contacts by location and priority
  getContactsByLocation(location: string, priority?: "High" | "Medium" | "Low"): Contact[] {
    let contacts = emergencyContacts.filter(contact => {
      if (location.includes("Mumbai")) return contact.name.includes("Mumbai")
      if (location.includes("Chennai")) return contact.name.includes("Chennai") 
      if (location.includes("Kochi")) return contact.name.includes("Kochi")
      return true // Default to all contacts
    })

    if (priority) {
      contacts = contacts.filter(contact => contact.priority === priority)
    }

    return contacts
  }

  // Format message with variables
  formatMessage(
    template: string,
    variables: {
      location: string
      severity: string
      waterLevel: number
      evacuation: string
    }
  ): string {
    return template
      .replace("{location}", variables.location)
      .replace("{severity}", variables.severity)
      .replace("{waterLevel}", variables.waterLevel.toString())
      .replace("{evacuation}", variables.evacuation)
  }

  // Send SMS to multiple contacts
  async sendSMS(message: SMSMessage): Promise<{ success: boolean; sent: number; failed: number; errors: string[] }> {
    const results = {
      success: true,
      sent: 0,
      failed: 0,
      errors: [] as string[]
    }

    // In production, replace this with actual SMS API calls
    for (const phoneNumber of message.to) {
      try {
        // Simulate API call
        await this.sendSingleSMS(phoneNumber, message.message)
        results.sent++
        console.log(`SMS sent to ${phoneNumber}: ${message.message}`)
      } catch (error) {
        results.failed++
        results.errors.push(`Failed to send to ${phoneNumber}: ${error}`)
        console.error(`Failed to send SMS to ${phoneNumber}:`, error)
      }
    }

    if (results.failed > 0) {
      results.success = false
    }

    return results
  }

  // Send SMS to contacts for a specific alert
  async sendFloodAlert(
    location: string,
    severity: "Critical" | "High" | "Medium" | "Low",
    waterLevel: number,
    evacuationStatus: "Required" | "Recommended" | "Monitor" | "None",
    customMessage?: string
  ): Promise<{ success: boolean; sent: number; failed: number; errors: string[] }> {
    
    // Get high priority contacts for critical/high alerts
    const priority = severity === "Critical" || severity === "High" ? "High" : "Medium"
    const contacts = this.getContactsByLocation(location, priority)
    
    if (contacts.length === 0) {
      return {
        success: false,
        sent: 0,
        failed: 0,
        errors: ["No emergency contacts found for this location"]
      }
    }

    const results = {
      success: true,
      sent: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Send messages in each contact's preferred language
    for (const contact of contacts) {
      try {
        let message = customMessage
        
        if (!message) {
          const template = messageTemplates.flood[contact.language]
          const evacuationText = evacuationStatus === "None" ? "" : 
            (evacuationMessages[evacuationStatus as keyof typeof evacuationMessages]?.[contact.language] || evacuationStatus)
          
          message = this.formatMessage(template, {
            location,
            severity,
            waterLevel,
            evacuation: evacuationText
          })
        }

        await this.sendSingleSMS(contact.phone, message)
        results.sent++
        console.log(`Alert sent to ${contact.name} (${contact.phone}): ${message}`)
        
      } catch (error) {
        results.failed++
        results.errors.push(`Failed to send to ${contact.name}: ${error}`)
        console.error(`Failed to send alert to ${contact.name}:`, error)
      }
    }

    if (results.failed > 0) {
      results.success = false
    }

    return results
  }

  // Private method to send single SMS (replace with actual SMS API)
  private async sendSingleSMS(phoneNumber: string, message: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
    
    // In production, implement actual SMS API call:
    /*
    const response = await fetch(`${this.apiUrl}/YOUR_ACCOUNT_SID/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.apiKey}:${this.apiSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: 'YOUR_TWILIO_PHONE_NUMBER',
        To: phoneNumber,
        Body: message
      })
    })
    
    if (!response.ok) {
      throw new Error(`SMS API error: ${response.statusText}`)
    }
    */
    
    // For demo purposes, just log the message
    if (Math.random() > 0.9) {
      throw new Error("Network timeout")
    }
  }

  // Get all contacts
  getAllContacts(): Contact[] {
    return emergencyContacts
  }

  // Add new contact
  addContact(contact: Omit<Contact, "id">): Contact {
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString()
    }
    emergencyContacts.push(newContact)
    return newContact
  }

  // Remove contact
  removeContact(contactId: string): boolean {
    const index = emergencyContacts.findIndex(c => c.id === contactId)
    if (index > -1) {
      emergencyContacts.splice(index, 1)
      return true
    }
    return false
  }
}
