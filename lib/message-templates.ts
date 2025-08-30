import { Language, CoastalZone } from './civil-defence-types'

// Core message templates for critical alert types
export const messageTemplates: Record<string, Record<Language, string>> = {
  cyclone_emergency: {
    hindi: "🚨 आपातकाल: {location} में गंभीर चक्रवात। तुरंत {shelter} जाएं। जीवन खतरे में! - नागरिक सुरक्षा",
    english: "🚨 EMERGENCY: Severe cyclone in {location}. Go to {shelter} immediately. Life threatening! - Civil Defence",
    tamil: "🚨 அவசரநிலை: {location} இல் கடுமையான புயல். உடனே {shelter} செல்லுங்கள். உயிருக்கு ஆபத்து! - சிவில் டிஃபென்ஸ்",
    gujarati: "🚨 કટોકટી: {location}માં ગંભીર ચક્રવાત. તુરંત {shelter} જાઓ. જીવલેણ! - સિવિલ ડિફેન્સ",
    bengali: "🚨 জরুরি অবস্থা: {location}এ মারাত্মক ঘূর্ণিঝড়। অবিলম্বে {shelter}এ যান। প্রাণঘাতী! - সিভিল ডিফেন্স",
    malayalam: "🚨 അടിയന്തരാവസ്ഥ: {location}ൽ കടുത്ത ചുഴലിക്കാറ്റ്. ഉടൻ {shelter}ൽ പോകുക. ജീവൻ അപകടത്തിൽ! - സിവിൽ ഡിഫൻസ്",
    marathi: "🚨 आणीबाणी: {location}मध्ये गंभीर चक्रीवादळ. लगेच {shelter} ला जा. जीवघेणे! - नागरी संरक्षण",
    telugu: "🚨 అత్యవసరం: {location}లో తీవ్ర తుఫాను. వెంటనే {shelter}కు వెళ్లండి. ప్రాణాంతకం! - సివిల్ డిఫెన్స్",
    kannada: "🚨 ತುರ್ತು: {location}ನಲ್ಲಿ ತೀವ್ರ ಚಂಡಮಾರುತ. ತಕ್ಷಣ {shelter}ಗೆ ಹೋಗಿ. ಜೀವಕ್ಕೆ ಅಪಾಯ! - ಸಿವಿಲ್ ಡಿಫೆನ್ಸ್",
    odia: "🚨 ଜରୁରୀ: {location}ରେ ଭୟଙ୍କର ଘୂର୍ଣିଝଡ଼। ତୁରନ୍ତ {shelter}କୁ ଯାଆନ୍ତୁ। ଜୀବନ ବିପଦରେ! - ସିଭିଲ ଡିଫେନ୍ସ"
  },
  tsunami_emergency: {
    hindi: "🚨 सुनामी आपातकाल: {location} में सुनामी! तुरंत भागें! ऊंचे स्थान पर जाएं! - नागरिक सुरक्षा",
    english: "🚨 TSUNAMI EMERGENCY: Tsunami in {location}! RUN NOW! Go to higher ground! - Civil Defence",
    tamil: "🚨 சுனாமி அவசரநிலை: {location} க்கு சுனாமி! இப்போதே ஓடுங்கள்! உயரமான இடத்திற்கு செல்லுங்கள்! - சிவில் டிஃபென்ஸ்",
    gujarati: "🚨 સુનામી કટોકટી: {location}માં સુનામી! હવે જ ભાગો! ઊંચી જગ્યાએ જાઓ! - સિવિલ ડિફેન્સ",
    bengali: "🚨 সুনামি জরুরি: {location}এ সুনামি! এখনই দৌড়ান! উঁচু জায়গায় যান! - সিভিল ডিফেন্স",
    malayalam: "🚨 സുനാമി അടിയന്തരം: {location}ൽ സുനാമി! ഇപ്പോൾ ഓടുക! ഉയർന്ന സ്ഥലത്തേക്ക് പോകുക! - സിവിൽ ഡിഫൻസ്",
    marathi: "🚨 सुनामी आणीबाणी: {location}मध्ये सुनामी! आता पळा! उंच जागी जा! - नागरी संरक्षण",
    telugu: "🚨 సునామీ అత్యవసరం: {location}లో సునామీ! ఇప్పుడే పరుగెత్తండి! ఎత్తైన ప్రాంతానికి వెళ్లండి! - సివిల్ డిఫెన్స్",
    kannada: "🚨 ಸುನಾಮಿ ತುರ್ತು: {location}ಗೆ ಸುನಾಮಿ! ಈಗಲೇ ಓಡಿ! ಎತ್ತರದ ಸ್ಥಳಕ್ಕೆ ಹೋಗಿ! - ಸಿವಿಲ್ ಡಿಫೆನ್ಸ್",
    odia: "🚨 ସୁନାମି ଜରୁରୀ: {location}କୁ ସୁନାମି! ଏବେ ଦୌଡ଼ନ୍ତୁ! ଉଚ୍ଚ ସ୍ଥାନକୁ ଯାଆନ୍ତୁ! - ସିଭିଲ ଡିଫେନ୍ସ"
  },
  all_clear: {
    hindi: "✅ सुरक्षा संदेश: {location} में खतरा समाप्त। सामान्य गतिविधियां शुरू कर सकते हैं। - नागरिक सुरक्षा",
    english: "✅ All Clear: Threat ended in {location}. Normal activities can resume. - Civil Defence",
    tamil: "✅ பாதுகாப்பு செய்தி: {location} இல் ஆபத்து முடிந்தது। சாதாரண நடவடிக்கைகளை தொடரலாம். - சிவில் டிஃபென்ஸ்",
    gujarati: "✅ સલામતી સંદેશ: {location}માં જોખમ સમાપ્ત. સામાન્ય પ્રવૃત્તિઓ શરૂ કરી શકો છો. - સિવિલ ડિફેન્સ",
    bengali: "✅ নিরাপত্তা বার্তা: {location}এ বিপদ শেষ। স্বাভাবিক কার্যক্রম শুরু করতে পারেন। - সিভিল ডিফেন্স",
    malayalam: "✅ സുരക്ഷാ സന്ദേശം: {location}ൽ അപകടം അവസാനിച്ചു. സാധാരണ പ്രവർത്തനങ്ങൾ പുനരാരംഭിക്കാം. - സിവിൽ ഡിഫൻസ്",
    marathi: "✅ सुरक्षा संदेश: {location}मध्ये धोका संपला. सामान्य क्रियाकलाप सुरू करू शकता. - नागरी संरक्षण",
    telugu: "✅ భద్రతా సందేశం: {location}లో ప్రమాదం ముగిసింది. సాధారణ కార్యకలాపాలు ప్రారంభించవచ్చు. - సివిల్ డిఫెన్స్",
    kannada: "✅ ಸುರಕ್ಷತಾ ಸಂದೇಶ: {location}ನಲ್ಲಿ ಅಪಾಯ ಮುಗಿದಿದೆ. ಸಾಮಾನ್ಯ ಚಟುವಟಿಕೆಗಳನ್ನು ಪ್ರಾರಂಭಿಸಬಹುದು. - ಸಿವಿಲ್ ಡಿಫೆನ್ಸ್",
    odia: "✅ ସୁରକ୍ଷା ସନ୍ଦେଶ: {location}ରେ ବିପଦ ସମାପ୍ତ। ସାଧାରଣ କାର୍ଯ୍ୟକଳାପ ଆରମ୍ଭ କରିପାରିବେ। - ସିଭିଲ ଡିଫେନ୍ସ"
  }
}

// Template variables that can be used in messages
export const templateVariables = {
  location: "Location name",
  shelter: "Nearest shelter location", 
  time: "Time/duration",
  contact: "Emergency contact number"
}

// Character count validation for SMS (160 character limit)
export function validateMessageLength(message: string): boolean {
  return message.length <= 160
}

// Replace template variables in message
export function processMessageTemplate(template: string, variables: Record<string, string>): string {
  let processed = template
  Object.entries(variables).forEach(([key, value]) => {
    processed = processed.replace(new RegExp(`{${key}}`, 'g'), value)
  })
  return processed
}

// Get available languages for a coastal zone
export function getZoneLanguages(zoneId: string): Language[] {
  // Mock data - in production this would come from database
  const zoneLanguageMap: Record<string, Language[]> = {
    'chennai-coast': ['tamil', 'english', 'hindi'],
    'mumbai-coast': ['marathi', 'hindi', 'english', 'gujarati'],
    'kolkata-coast': ['bengali', 'hindi', 'english'],
    'kochi-coast': ['malayalam', 'english', 'hindi'],
    'visakhapatnam-coast': ['telugu', 'hindi', 'english'],
    'mangalore-coast': ['kannada', 'hindi', 'english'],
    'bhubaneswar-coast': ['odia', 'hindi', 'english']
  }
  
  return zoneLanguageMap[zoneId] || ['english', 'hindi']
}

// Language display names
export const languageNames: Record<Language, string> = {
  hindi: "हिंदी",
  english: "English", 
  tamil: "தமிழ்",
  gujarati: "ગુજરાતી",
  bengali: "বাংলা",
  malayalam: "മലയാളം",
  marathi: "मराठी",
  telugu: "తెలుగు",
  kannada: "ಕನ್ನಡ",
  odia: "ଓଡ଼ିଆ"
}

// Predefined coastal zones for India
export const coastalZones: CoastalZone[] = [
  {
    id: 'chennai-coast',
    name: 'Chennai Coast',
    state: 'Tamil Nadu',
    coordinates: [
      { lat: 13.0827, lng: 80.2707 },
      { lat: 13.1000, lng: 80.3000 },
      { lat: 13.0500, lng: 80.2500 }
    ],
    radius: 30000,
    population: 2100000,
    primaryLanguages: ['tamil', 'english', 'hindi'] as Language[],
    shelters: ['Chennai Central Shelter', 'Marina Beach Evacuation Center', 'Egmore Community Hall'],
    cellTowers: ['Chennai-CT-001', 'Chennai-CT-002', 'Chennai-CT-003'],
    harbors: ['Chennai Port', 'Ennore Port'],
    villages: ['Kasimedu Village', 'Thiruvanmiyur Village', 'Besant Nagar']
  },
  {
    id: 'mumbai-coast',
    name: 'Mumbai Coastal Region',
    state: 'Maharashtra',
    coordinates: [{ lat: 19.0760, lng: 72.8777 }],
    radius: 50000,
    population: 2500000,
    primaryLanguages: ['hindi', 'marathi', 'english'] as Language[],
    shelters: ['Mumbai Central Shelter', 'Bandra Community Center', 'Andheri Sports Complex'],
    cellTowers: ['Mumbai-CT-001', 'Mumbai-CT-002', 'Mumbai-CT-003'],
    harbors: ['Mumbai Port', 'Nhava Sheva Port'],
    villages: ['Worli Village', 'Mahim Village', 'Versova Village']
  },
  {
    id: 'kolkata-coast',
    name: 'Kolkata Coast',
    state: 'West Bengal', 
    coordinates: [
      { lat: 22.5726, lng: 88.3639 },
      { lat: 22.6000, lng: 88.4000 },
      { lat: 22.5500, lng: 88.3500 }
    ],
    radius: 20000,
    population: 1200000,
    primaryLanguages: ['bengali', 'hindi', 'english'] as Language[],
    shelters: ['Howrah Station', 'Sealdah Community Center', 'Government Hospital'],
    cellTowers: ['Kolkata-CT-001', 'Kolkata-CT-002'],
    harbors: ['Kolkata Port', 'Haldia Port'],
    villages: ['Sundarbans Village', 'Diamond Harbour', 'Kakdwip']
  },
  {
    id: 'kochi-coast',
    name: 'Kochi Coastal Region',
    state: 'Kerala',
    coordinates: [
      { lat: 9.9312, lng: 76.2673 },
      { lat: 10.0000, lng: 76.3000 }
    ],
    radius: 25000,
    population: 800000,
    primaryLanguages: ['malayalam', 'english', 'hindi'] as Language[],
    shelters: ['Kochi Marine Drive Center', 'Ernakulam Community Hall'],
    cellTowers: ['Kochi-CT-001', 'Kochi-CT-002'],
    harbors: ['Kochi Port', 'Willingdon Island'],
    villages: ['Fort Kochi', 'Mattancherry', 'Kumbakonam']
  },
  {
    id: 'visakhapatnam-coast',
    name: 'Visakhapatnam Coast',
    state: 'Andhra Pradesh',
    coordinates: [
      { lat: 17.6868, lng: 83.2185 },
      { lat: 17.7000, lng: 83.2500 }
    ],
    radius: 35000,
    population: 1500000,
    primaryLanguages: ['telugu', 'english', 'hindi'] as Language[],
    shelters: ['Visakhapatnam Beach Shelter', 'RK Beach Community Center'],
    cellTowers: ['Vizag-CT-001', 'Vizag-CT-002', 'Vizag-CT-003'],
    harbors: ['Visakhapatnam Port', 'Gangavaram Port'],
    villages: ['Rushikonda', 'Bheemunipatnam', 'Yarada']
  }
]
