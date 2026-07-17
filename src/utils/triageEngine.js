/**
 * Local Triage Expert System (Manchester Triage System & WHO IMCI inspired)
 * With full multilingual support (English, Hindi, Telugu) for all outputs.
 */

const containsAny = (text, keywords) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

export const runLocalTriage = (vitals, symptoms = "") => {
  const age = parseFloat(vitals.age) || 30;
  const temp = parseFloat(vitals.temperature) || 98.6;
  const hr = parseFloat(vitals.heartRate) || 80;
  const sys = parseFloat(vitals.systolic) || 120;
  const dia = parseFloat(vitals.diastolic) || 80;

  let isRed = false;
  let isOrange = false;
  let isYellow = false;
  
  const reasons = [];

  // Vitals Rules
  if (sys < 90 && age > 12) {
    isRed = true;
    reasons.push("Extremely low blood pressure (Potential Shock)");
  }
  if (sys >= 180 || dia >= 120) {
    isRed = true;
    reasons.push("Hypertensive Crisis (Extremely high blood pressure)");
  }
  if (temp >= 104) {
    isRed = true;
    reasons.push("Hyperpyrexia (Extreme body temperature)");
  }
  if (hr >= 140 || (hr < 45 && hr > 0)) {
    isRed = true;
    reasons.push("Critical heart rate anomaly");
  }

  // Symptom Red Keywords
  const redKeywords = [
    "chest pain", "heart attack", "difficulty breathing", "cannot breathe", 
    "shortness of breath", "unconscious", "passed out", "fainted", "unresponsive",
    "severe bleeding", "stiff neck", "paralysis", "stroke", "seizure", "fits", 
    "poison", "snake bite", "choking", "suicidal"
  ];
  if (containsAny(symptoms, redKeywords)) {
    isRed = true;
    reasons.push("Life-threatening symptoms reported");
  }

  // Symptom Orange Keywords
  const orangeKeywords = [
    "severe headache", "severe abdominal pain", "severe stomach pain", 
    "uncontrolled vomiting", "vomiting everything", "dehydration", "deep cut", 
    "fracture", "broken bone", "burn", "chest tightness", "high fever", "unable to swallow"
  ];
  if (!isRed && (containsAny(symptoms, orangeKeywords) || temp >= 101.5 || hr >= 120 || sys >= 150)) {
    isOrange = true;
    reasons.push("High-priority clinical indicators");
  }

  // Symptom Yellow Keywords
  const yellowKeywords = [
    "vomiting", "diarrhea", "moderate pain", "persistent cough", "dizzy", "dizziness", 
    "ear pain", "body rash", "urinary pain", "burning urination", "joint pain", "sprain"
  ];
  if (!isRed && !isOrange && (containsAny(symptoms, yellowKeywords) || temp >= 99.5 || hr >= 100)) {
    isYellow = true;
    reasons.push("Moderate urgency symptoms");
  }

  let triageColor = "GREEN";
  let conditionPossibilities = {};
  let firstAidInstructions = {};
  let redFlags = {};
  let translatedSummary = {};

  if (isRed) {
    triageColor = "RED";
    
    conditionPossibilities = {
      en: `Immediate Emergency Case. Critical markers identified: ${reasons.join(", ")}. Suspected acute organ threat.`,
      hi: `अति गंभीर आपातकालीन मामला। चिन्हित लक्षण: ${reasons.join(", ")}। अंग विफलता या जान का खतरा हो सकता है।`,
      te: `అత్యవసర పరిస్థితి. గుర్తించిన సమస్యలు: ${reasons.join(", ")}. ప్రాణాపాయం ఉండే అవకాశం ఉంది.`
    };

    firstAidInstructions = {
      en: [
        "Keep the patient calm, sitting or lying down comfortably.",
        "If difficulty breathing, help them sit upright. Do not block airway.",
        "If chest pain, do not let them walk. Give aspirin if prescribed and not allergic.",
        "If bleeding, apply direct, firm pressure to the wound with a clean cloth.",
        "In case of unconsciousness, place on their side (recovery position) and monitor breathing."
      ],
      hi: [
        "मरीज को शांत रखें, आराम से लेटने या बैठने दें।",
        "सांस लेने में तकलीफ हो तो मरीज को सीधा बैठाएं। हवा का रास्ता न रोकें।",
        "यदि छाती में दर्द हो, तो मरीज को चलने न दें। एलर्जी न होने पर एस्पिरिन दें।",
        "यदि खून बह रहा हो, तो साफ कपड़े से घाव को सीधे दबाएं।",
        "मरीज बेहोश हो तो करवट सुलाएं (recovery position) और सांस चेक करते रहें।"
      ],
      te: [
        "రోగిని ప్రశాంతంగా ఉంచండి, హాయిగా పడుకోబెట్టండి లేదా కూర్చోబెట్టండి.",
        "శ్వాస తీసుకోవడంలో ఇబ్బంది ఉంటే, నిటారుగా కూర్చోబెట్టండి. శ్వాస మార్గాన్ని అడ్డుకోవద్దు.",
        "ఛాతీ నొప్పి ఉంటే, నడవనివ్వవద్దు. అలర్జీ లేకపోతే ఆస్పిరిన్ టాబ్లెట్ ఇవ్వండి.",
        "రక్తస్రావం అవుతుంటే, శుభ్రమైన బట్టతో గాయంపై గట్టిగా నొక్కండి.",
        "స్పృహ కోల్పోతే, రోగిని పక్కకు తిప్పి పడుకోబెట్టండి (రికవరీ పొజిషన్) మరియు శ్వాసను గమనించండి."
      ]
    };

    redFlags = {
      en: [
        "Loss of consciousness or gasping for breath.",
        "Sudden weakness or numbness on one side of the face, arm, or leg.",
        "Bluish tint on lips or fingernails."
      ],
      hi: [
        "बेहोशी आना या सांस लेने के लिए हांफना।",
        "चेहरे, हाथ या पैर के एक तरफ अचानक कमजोरी या सुन्नता आना।",
        "होठों या नाखूनों का रंग नीला पड़ना।"
      ],
      te: [
        "స్పృహ కోల్పోవడం లేదా శ్వాస కోసం కొట్టుకోవడం.",
        "ముఖం, చేయి లేదా కాలు ఒక వైపు అకస్మాత్తుగా బలహీనపడటం లేదా తిమ్మిరి రావడం.",
        "పెదవులు లేదా గోర్లు నీలం రంగులోకి మారడం."
      ]
    };

    translatedSummary = {
      en: "RED Status: Emergency case. Arrange immediate transport to the nearest hospital.",
      hi: "अति गंभीर आपातकाल (RED): मरीज को तुरंत एम्बुलेंस से अस्पताल ले जाएं। श्वास नली को खुला रखें और रक्तस्राव होने पर सीधे दबाएं।",
      te: "అత్యవసర పరిస్థితి (RED): రోగిని వెంటనే ఆసుపత్రికి తరలించండి. శ్వాస మార్గాన్ని స్పష్టంగా ఉంచండి మరియు రక్తస్రావం అయితే గట్టిగా నొక్కండి."
    };

  } else if (isOrange) {
    triageColor = "ORANGE";
    
    conditionPossibilities = {
      en: "Very Urgent Case. Severe symptoms or high vitals detected. High risk of dehydration or acute infection.",
      hi: "अति गंभीर मामला। तेज बुखार, निर्जलीकरण (dehydration) या तीव्र संक्रमण की उच्च आशंका है।",
      te: "తీవ్రమైన పరిస్థితి. అధిక జ్వరం, నిర్జలీకరణం లేదా తీవ్రమైన ఇన్‌ఫెక్షన్ వచ్చే అవకాశం ఉంది."
    };

    firstAidInstructions = {
      en: [
        "Provide hydration (ORS or water) if patient is conscious and not vomiting persistently.",
        "For fever, apply cool wet forehead compresses. Give paracetamol.",
        "Keep the patient rested. Restrict solid food if severe abdominal pain is present.",
        "Clean wounds/burns with clean running water and cover with dry cloth."
      ],
      hi: [
        "यदि मरीज होश में है और लगातार उल्टी नहीं कर रहा है, तो ओआरएस (ORS) या पानी दें।",
        "बुखार के लिए माथे पर ठंडे पानी की पट्टियां रखें। पैरासिटामोल दवा दें।",
        "मरीज को आराम करने दें। पेट में तेज दर्द हो, तो कुछ भी ठोस खाने को न दें।",
        "किसी भी घाव या जलन को साफ बहते पानी से धोएं; साफ कपड़े से ढकें।"
      ],
      te: [
        "రోగి స్పృహలో ఉండి, నిరంతరం వాంతులు చేసుకోకపోతే ORS లేదా నీరు ఇవ్వండి.",
        "జ్వరం కోసం, నుదుటిపై చల్లని తడి బట్టతో తుడవండి. పారాసిటమాల్ ఇవ్వండి.",
        "రోగికి విశ్రాంతి ఇవ్వండి. తీవ్రమైన కడుపు నొప్పి ఉంటే ఘన ఆహారం ఇవ్వవద్దు.",
        "గాయాలు లేదా కాలిన గాయాలను శుభ్రమైన నీటితో కడగండి మరియు పొడి బట్టతో కప్పండి."
      ]
    };

    redFlags = {
      en: [
        "Onset of confusion, slurred speech, or extreme drowsiness.",
        "Inability to retain any fluids (vomiting everything).",
        "Temperature rises above 103°F."
      ],
      hi: [
        "अचानक भ्रम होना, बोलने में लड़खड़ाहट या अत्यधिक सुस्ती आना।",
        "तरल पदार्थ पीने में असमर्थता (लगातार उल्टी होना)।",
        "बुखार 103°F से ऊपर जाना।"
      ],
      te: [
        "అకస్మాత్తుగా గందరగోళం, అస్పష్టమైన మాటలు లేదా విపరీతమైన మగత.",
        "ద్రవాలను తీసుకోలేకపోవడం (నిరంతర వాంతులు).",
        "జ్వరం 103°F కంటే ఎక్కువ పెరగడం."
      ]
    };

    translatedSummary = {
      en: "ORANGE Status: Very urgent case. Plan for medical consultation within 1-2 hours.",
      hi: "त्वरित उपचार आवश्यक (ORANGE): मरीज को जल्द से जल्द डॉक्टर से दिखाएं। बुखार होने पर माथे पर पट्टी रखें और ओआरएस (ORS) दें।",
      te: "త్వరగా చికిత్స అవసరం (ORANGE): రోగిని వీలైనంత త్వరగా వైద్యుడి వద్దకు తీసుకెళ్లండి. జ్వరం ఉంటే తడి బట్టతో తుడవండి మరియు ORS ఇవ్వండి."
    };

  } else if (isYellow) {
    triageColor = "YELLOW";
    
    conditionPossibilities = {
      en: "Urgent Case. Stable vitals with mild-to-moderate symptoms. Safe for scheduled clinic visit.",
      hi: "सामान्य मामला। स्थिर वाइटल्स के साथ मध्यम लक्षण। नियमित ओपीडी जांच की सलाह दी जाती है।",
      te: "సాధారణ పరిస్థితి. స్థిరమైన వైటల్స్ మరియు మధ్యస్థ లక్షణాలు. డాక్టర్‌ని సంప్రదించండి."
    };

    firstAidInstructions = {
      en: [
        "For diarrhea/vomiting: feed ORS frequently in small sips.",
        "Recommend absolute rest and light home-cooked diet.",
        "Use paracetamol for pain or mild fever relief."
      ],
      hi: [
        "दस्त/उल्टी के लिए: बार-बार घूंट-घूंट करके ओआरएस (ORS) घोल पिलाएं।",
        "मरीज को पर्याप्त आराम और हल्का सुपाच्य भोजन (जैसे खिचड़ी) दें।",
        "दर्द या हल्के बुखार से राहत के लिए पैरासिटामोल का उपयोग करें।"
      ],
      te: [
        "విరేచనాలు/వాంతులు కోసం: తరచుగా కొద్దికొద్దిగా ORS ద్రావణం తాగించండి.",
        "రోగికి పూర్తి విశ్రాంతి మరియు తేలికపాటి ఆహారం (కిచిడి వంటివి) ఇవ్వండి.",
        "నొప్పి లేదా తేలికపాటి జ్వరం ఉపశమనం కోసం పారాసిటమాల్ ఉపయోగించండి."
      ]
    };

    redFlags = {
      en: [
        "Symptoms fail to improve or worsen after 24-48 hours.",
        "Develops high fever or severe abdominal cramps.",
        "Severe dehydration signs (sunken eyes, no urine for 6 hours)."
      ],
      hi: [
        "लक्षण 24-48 घंटों के बाद भी ठीक न होना या बिगड़ जाना।",
        "तेज बुखार या गंभीर पेट दर्द होना।",
        "गंभीर निर्जलीकरण के लक्षण (धंसी हुई आंखें, 6 घंटे से पेशाब न होना)।"
      ],
      te: [
        "24-48 గంటల తర్వాత కూడా లక్షణాలు మెరుగుపడకపోవడం లేదా మరింత క్షీణించడం.",
        "అధిక జ్వరం లేదా తీవ్రమైన కడుపు నొప్పి రావడం.",
        "తీవ్రమైన నిర్జలీకరణ సంకేతాలు (కళ్ళు లోతుకు పోవడం, 6 గంటల పాటు మూత్రం రాకపోవడం)."
      ]
    };

    translatedSummary = {
      en: "YELLOW Status: Urgent but stable. Advise clinic visit if symptoms persist.",
      hi: "सामान्य उपचार (YELLOW): मरीज की स्थिति स्थिर है लेकिन डॉक्टर से सलाह लें। ओआरएस (ORS) घोल दें और आराम करने कहें।",
      te: "సాధారణ చికిత్స (YELLOW): రోగి పరిస్థితి స్థిరంగా ఉంది కానీ డాక్టర్‌ని సంప్రదించండి. ORS ద్రావణం ఇవ్వండి మరియు విశ్రాంతి తీసుకోమనండి."
    };

  } else {
    triageColor = "GREEN";
    
    conditionPossibilities = {
      en: "Standard / Non-Urgent. Symptoms suggest common cold, mild allergies, or minor abrasions.",
      hi: "गैर-आपातकालीन। लक्षण सामान्य सर्दी-जुकाम, मामूली एलर्जी या छोटी खरोंच की ओर इशारा करते हैं।",
      te: "సాధారణ స్థితి. లక్షణాలు సాధారణ జలుబు, తేలికపాటి అలెర్జీలు లేదా చిన్న గీతలను సూచిస్తాయి."
    };

    firstAidInstructions = {
      en: [
        "Recommend adequate rest and warm fluid intake.",
        "For minor skin scrapes, wash with soap and water, then apply clean dressing.",
        "Monitor temperature and symptoms twice daily."
      ],
      hi: [
        "पर्याप्त आराम करने और गुनगुना तरल पदार्थ (जैसे गुनगुना पानी, काढ़ा) पीने की सलाह दें।",
        "छोटे-मोटे खरोंच के लिए, साबुन और पानी से धोएं, फिर साफ पट्टी बांधें।",
        "दिन में दो बार बुखार और लक्षणों की जांच करते रहें।"
      ],
      te: [
        "తగినంత విశ్రాంతి మరియు గోరువెచ్చని ద్రవాలు తాగడం మంచిది.",
        "చిన్న గీతలు పడితే, సబ్బు మరియు నీటితో కడిగి, శుభ్రమైన కట్టు కట్టండి.",
        "రోజుకు రెండుసార్లు శరీర ఉష్ణోग्रత మరియు లక్షణాలను గమనించండి."
      ]
    };

    redFlags = {
      en: [
        "Development of chest discomfort or breathing trouble.",
        "Fever develops or rises above 100°F.",
        "Symptom duration exceeds 5 days."
      ],
      hi: [
        "छाती में दर्द या सांस लेने में कठिनाई होना।",
        "बुखार का आना या 100°F से ऊपर जाना।",
        "लक्षणों का 5 दिनों से अधिक समय तक बने रहना।"
      ],
      te: [
        "ఛాతీలో అసౌకర్యం లేదా శ్వాస తీసుకోవడంలో ఇబ్బంది కలగడం.",
        "జ్వరం రావడం లేదా 100°F కంటే ఎక్కువ పెరగడం.",
        "లక్షణాలు 5 రోజుల కంటే ఎక్కువ ఉండటం."
      ]
    };

    translatedSummary = {
      en: "GREEN Status: Non-urgent. Home-care monitoring recommended.",
      hi: "गैर-आपातकालीन (GREEN): मरीज की स्थिति सामान्य है। आराम करें, गुनगुना पानी पिएं और लक्षणों पर नजर रखें।",
      te: "సాధారణ స్థితి (GREEN): రోగికి విశ్రాంతి అవసరం. గోరువెచ్చని నీరు తాగించండి, ఒకవేళ జ్వరం వస్తే డాక్టర్‌ని కలవండి."
    };
  }

  return {
    triageColor,
    conditionPossibilities,
    firstAidInstructions,
    redFlags,
    translatedSummary
  };
};
