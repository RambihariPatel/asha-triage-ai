import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Heart, 
  Flame, 
  Droplets, 
  Bug, 
  Zap, 
  Baby, 
  Thermometer, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  Volume2, 
  Shield 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const EmergencyProtocols = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const { t, language } = useLanguage();
  const [audioLanguage, setAudioLanguage] = useState(language);

  React.useEffect(() => {
    setAudioLanguage(language);
  }, [language]);

  const protocols = [
    {
      id: 1,
      title: { en: 'Snake Bite', hi: 'सर्पदंश (सांप का काटना)', te: 'పాము కాటు' },
      icon: <Bug size={24} />,
      severity: 'RED',
      suspect: [
        'Visible bite marks (two puncture wounds)',
        'Swelling, redness, or pain at the bite site',
        'Difficulty breathing or vision blurring',
        'Foaming at mouth or dizziness'
      ],
      steps: {
        en: [
          'Keep the patient absolutely calm and still to prevent poison spread.',
          'Remove rings, watches, or tight clothing near the bite.',
          'Wash the area with soap and water.',
          'Do NOT cut the wound or try to suck the venom out.',
          'Do NOT tie a tight tourniquet (use a loose bandage if needed).',
          'Transport immediately to a hospital with anti-venom.'
        ],
        hi: [
          'मरीज को शांत रखें और हिलने-डुलने न दें ताकि ज़हर शरीर में न फैले।',
          'काटे गए स्थान के पास से अंगूठी, घड़ी या तंग कपड़े तुरंत हटा दें।',
          'घाव को साबुन और पानी से धीरे-धीरे धोएं।',
          'घाव को काटने या मुँह से ज़हर चूसने की कोशिश बिल्कुल न करें।',
          'घाव के ऊपर बहुत कसकर पट्टी न बांधें, हल्का कपड़ा लपेट सकते हैं।',
          'तुरंत मरीज को एंटी-वेनम वाले अस्पताल ले जाएं।'
        ],
        te: [
          'విషం వ్యాపించకుండా రోగిని ప్రశాంతంగా మరియు కదలకుండా ఉంచండి.',
          'కాటు సమీపంలో ఉంగరాలు, గడియారాలు లేదా గట్టి దుస్తులను తొలగించండి.',
          'గాయాన్ని సబ్బు మరియు నీటితో కడగాలి.',
          'గాయాన్ని కోయవద్దు లేదా విషాన్ని పీల్చడానికి ప్రయత్నించవద్దు.',
          'గట్టిగా కట్టు కట్టవద్దు (అవసరమైతే వదులుగా ఉండే బ్యాండేజ్ ఉపయోగించండి).',
          'తక్షణమే యాంటీ-వెనమ్ ఉన్న ఆసుపత్రికి తరలించండి.'
        ]
      },
      redFlags: ['Loss of consciousness', 'Paralysis or breathing stops', 'Bleeding from gums'],
      helpline: '108'
    },
    {
      id: 2,
      title: { en: 'Heart Attack / Chest Pain', hi: 'दिल का दौरा (Heart Attack)', te: 'గుండెపోటు' },
      icon: <Heart size={24} />,
      severity: 'RED',
      suspect: [
        'Severe squeezing chest pain',
        'Pain radiating to left arm, neck, or jaw',
        'Profuse sweating and shortness of breath',
        'Nausea or vomiting'
      ],
      steps: {
        en: [
          'Make the patient sit down, rest, and keep calm.',
          'Loosen any tight clothing around the neck and chest.',
          'If conscious and not allergic, give one Aspirin (300mg) to chew.',
          'If unconscious and not breathing, start CPR immediately.',
          'Call for an ambulance with oxygen support.'
        ],
        hi: [
          'मरीज को तुरंत बैठा दें, आराम कराएं और शांत रखें।',
          'गर्दन और छाती के आसपास के तंग कपड़े ढीले कर दें।',
          'यदि मरीज होश में है और कोई एलर्जी नहीं है, तो एक एस्पिरिन (300mg) चबाने को दें।',
          'यदि मरीज बेहोश है और सांस नहीं ले रहा है, तो तुरंत CPR शुरू करें।',
          'ऑक्सीजन सुविधा वाली एम्बुलेंस को तुरंत बुलाएं।'
        ],
        te: [
          'రోగిని కూర్చోబెట్టి, విశ్రాంతి తీసుకోనివ్వండి మరియు ప్రశాంతంగా ఉంచండి.',
          'మెడ మరియు ఛాతీ చుట్టూ ఉన్న గట్టి దుస్తులను వదులు చేయండి.',
          'స్పృహలో ఉండి, అలెర్జీ లేకపోతే, నమలడానికి ఒక ఆస్పిరిన్ (300mg) ఇవ్వండి.',
          'స్పృహ లేకపోతే మరియు శ్వాస తీసుకోకపోతే, వెంటనే CPR ప్రారంభించండి.',
          'ఆక్సిజన్ సదుపాయం ఉన్న అంబులెన్స్‌ను పిలవండి.'
        ]
      },
      redFlags: ['Patient stops breathing', 'Pulse becomes undetectable', 'Lips turn blue'],
      helpline: '108'
    },
    {
      id: 3,
      title: { en: 'Severe Burns', hi: 'गंभीर जलना (Burns)', te: 'తీవ్రమైన కాలిన గాయాలు' },
      icon: <Flame size={24} />,
      severity: 'RED',
      suspect: [
        'Skin is charred, white, or blistered extensively',
        'Burns on face, hands, feet, or genitals',
        'Chemical or electrical burns',
        'Smoke inhalation symptoms (coughing, black soot)'
      ],
      steps: {
        en: [
          'Remove the person from the heat source safely.',
          'Cool the burn under cool (not ice cold) running water for 15-20 minutes.',
          'Remove jewelry or tight items from the burned area before swelling starts.',
          'Do NOT break blisters or apply ice, butter, or ointments.',
          'Cover the burn loosely with a clean, sterile, non-stick cloth.',
          'Keep the patient warm to prevent shock.'
        ],
        hi: [
          'व्यक्ति को आग या गर्मी के स्रोत से सुरक्षित बाहर निकालें।',
          'जले हुए हिस्से को 15-20 मिनट तक बहते हुए ठंडे (बर्फ वाले नहीं) पानी के नीचे रखें।',
          'सूजन शुरू होने से पहले जले हुए हिस्से से गहने या तंग कपड़े हटा दें।',
          'फफोलों को न फोड़ें और बर्फ, मक्खन या कोई मलहम न लगाएं।',
          'जले हुए हिस्से को साफ, सूखे और न चिपकने वाले कपड़े से हल्के से ढक दें।',
          'मरीज को गर्म रखें ताकि वह सदमे (shock) में न जाए।'
        ],
        te: [
          'వ్యక్తిని వేడి మూలం నుండి సురక్షితంగా దూరంగా తీసుకెళ్లండి.',
          'కాలిన గాయాన్ని 15-20 నిమిషాల పాటు చల్లటి (మంచు కాదు) పారే నీటి కింద ఉంచండి.',
          'వాపు ప్రారంభం కావడానికి ముందే నగలు లేదా గట్టి వస్తువులను తొలగించండి.',
          'పొక్కులను పగలగొట్టవద్దు లేదా మంచు, వెన్న లేదా లేపనాలు పూయవద్దు.',
          'కాలిన గాయాన్ని శుభ్రమైన, అంటుకోని వస్త్రంతో వదులుగా కప్పండి.',
          'షాక్‌ను నివారించడానికి రోగిని వెచ్చగా ఉంచండి.'
        ]
      },
      redFlags: ['Difficulty breathing', 'Burns covering large body areas', 'Signs of shock'],
      helpline: '108'
    },
    {
      id: 4,
      title: { en: 'Severe Dehydration', hi: 'गंभीर निर्जलीकरण (दस्त/उल्टी)', te: 'తీవ్రమైన నిర్జలీకరణం' },
      icon: <Droplets size={24} />,
      severity: 'ORANGE',
      suspect: [
        'Continuous vomiting or severe diarrhea',
        'Sunken eyes, extreme thirst',
        'Dry mouth and tongue',
        'No urination for >6 hours (especially in children)'
      ],
      steps: {
        en: [
          'Start Oral Rehydration Salts (ORS) solution immediately.',
          'Give small, frequent sips of ORS (do not force large amounts).',
          'Continue breastfeeding for infants.',
          'If the patient cannot drink or is vomiting everything, they need IV fluids.',
          'Keep the patient cool and resting.'
        ],
        hi: [
          'तुरंत ORS (जीवन रक्षक घोल) पिलाना शुरू करें।',
          'ORS के छोटे-छोटे घूंट बार-बार दें (एक साथ बहुत सारा न पिलाएं)।',
          'छोटे बच्चों को स्तनपान (breastfeeding) जारी रखें।',
          'यदि मरीज कुछ पी नहीं पा रहा है या हर बार उल्टी कर देता है, तो IV फ्लूइड (ड्रिप) की जरूरत है।',
          'मरीज को ठंडी जगह पर आराम करने दें।'
        ],
        te: [
          'తక్షణమే ORS (ఓరల్ రీహైడ్రేషన్ సాల్ట్స్) ద్రావణాన్ని ప్రారంభించండి.',
          'ORS కొద్దికొద్దిగా, తరచుగా త్రాగించండి (ఎక్కువగా బలవంతం చేయవద్దు).',
          'శిశువులకు తల్లిపాలు ఇవ్వడం కొనసాగించండి.',
          'రోగి త్రాగలేకపోతే లేదా ప్రతిదీ వాంతి చేసుకుంటే, వారికి IV ద్రవాలు అవసరం.',
          'రోగిని చల్లగా ఉంచి విశ్రాంతి తీసుకోనివ్వండి.'
        ]
      },
      redFlags: ['Lethargy or unconsciousness', 'Inability to drink', 'Blood in stool'],
      helpline: '104'
    }
  ];

  const handleSpeak = (protocol) => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    let speechLang = "en-US";
    let textToSpeak = `${protocol.title[audioLanguage]}. `;
    
    if (audioLanguage === 'hi') {
      speechLang = "hi-IN";
      textToSpeak += "आपातकालीन निर्देश: " + protocol.steps.hi.join(". ");
    } else if (audioLanguage === 'te') {
      speechLang = "te-IN";
      textToSpeak += "ప్రథమ చికిత్స సూచనలు: " + protocol.steps.te.join(". ");
    } else {
      textToSpeak += "Emergency Instructions: " + protocol.steps.en.join(". ");
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = speechLang;
    
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(speechLang) || v.lang.includes(speechLang));
    if (voice) utterance.voice = voice;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const getSeverityBadgeClass = (color) => {
    switch (color?.toUpperCase()) {
      case 'RED': return 'red';
      case 'ORANGE': return 'orange';
      case 'YELLOW': return 'yellow';
      case 'GREEN': return 'green';
      default: return 'green';
    }
  };

  return (
    <div className="app-layout-page">
      <Navbar />

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.25rem', width: '100%', animation: 'slideUp 0.4s ease' }}>
        <button onClick={() => navigate('/')} className="btn-secondary" style={{ marginBottom: '1.5rem', width: 'fit-content' }}>
          <ArrowLeft size={16} /> {t('Back to Dashboard', { hi: 'डैशबोर्ड पर वापस जाएं', te: 'డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి' })}
        </button>

        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h1 className="dashboard-title" style={{ fontSize: '2.5rem' }}>
            <Shield style={{ color: 'var(--primary-solid)' }} /> 
            {t('Emergency Protocols', { hi: 'आपातकालीन प्रोटोकॉल', te: 'అత్యవసర ప్రోటోకాల్స్' })}
          </h1>
          <p className="dashboard-subtitle">
            {t('Quick reference guides & first-aid steps for critical village emergencies.', { hi: 'ग्रामीण आपात स्थितियों के लिए त्वरित निर्देश और प्राथमिक उपचार मार्गदर्शिका।', te: 'గ్రామీణ అత్యవసర పరిస్థితుల కోసం శీఘ్ర సూచనలు మరియు ప్రథమ చికిత్స గైడ్.' })}
          </p>
        </div>

        {/* Emergency Banner */}
        <div style={{
          backgroundColor: 'var(--triage-red-bg)',
          border: '1.5px solid var(--color-error)',
          borderRadius: 'var(--border-radius-md)',
          padding: '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AlertTriangle size={32} color="var(--color-error)" />
            <div>
              <h3 style={{ margin: 0, color: 'var(--color-error)', fontSize: '1.25rem', fontWeight: 800 }}>{t('National Ambulance Service', { hi: 'राष्ट्रीय एम्बुलेंस सेवा', te: 'జాతీయ అంబులెన్స్ సేవ' })}</h3>
              <p style={{ margin: 0, color: 'var(--triage-red-text)', fontWeight: 600 }}>{t('Toll-Free Emergency Helpline', { hi: 'टोल-फ्री आपातकालीन हेल्पलाइन', te: 'ఉచిత అత్యవసర హెల్ప్‌లైన్' })}</p>
            </div>
          </div>
          <a href="tel:108" style={{
            backgroundColor: 'var(--color-error)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 800,
            fontSize: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
          }}>
            <Phone size={20} /> {t('DIAL 108', { hi: 'डायल करें 108', te: 'డయల్ చేయండి 108' })}
          </a>
        </div>

        {/* Audio Language Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-light)' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{t('Audio Read Language:', { hi: 'ऑडियो सुनने की भाषा:', te: 'ఆడియో వినే భాష:' })}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['en', 'hi', 'te'].map(lang => (
              <button 
                key={lang}
                onClick={() => setAudioLanguage(lang)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '50px',
                  border: `1.5px solid ${audioLanguage === lang ? 'var(--primary-solid)' : 'var(--border-color)'}`,
                  backgroundColor: audioLanguage === lang ? 'var(--primary-solid)' : 'transparent',
                  color: audioLanguage === lang ? 'white' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'తెలుగు'}
              </button>
            ))}
          </div>
        </div>

        {/* Protocol Accordions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {protocols.map(protocol => (
            <div key={protocol.id} style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-light)',
              borderRadius: 'var(--border-radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.3s ease'
            }}>
              {/* Header */}
              <div 
                onClick={() => setExpandedId(expandedId === protocol.id ? null : protocol.id)}
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  backgroundColor: expandedId === protocol.id ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    backgroundColor: `var(--triage-${protocol.severity.toLowerCase()}-bg)`,
                    color: `var(--triage-${protocol.severity.toLowerCase()}-text)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {protocol.icon}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {protocol.title.en}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {protocol.title.hi}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`severity-badge ${getSeverityBadgeClass(protocol.severity)}`}>
                    {protocol.severity}
                  </span>
                  {expandedId === protocol.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>

              {/* Body */}
              {expandedId === protocol.id && (
                <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', animation: 'fadeIn 0.3s' }}>
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Read Audio Button */}
                    <button 
                      onClick={() => handleSpeak(protocol)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary-hover)',
                        border: 'none', padding: '0.75rem 1.25rem',
                        borderRadius: 'var(--border-radius-sm)',
                        fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                        width: 'fit-content'
                      }}
                    >
                      <Volume2 size={18} />
                      {isPlayingAudio ? t('Stop Reading', {hi: 'पढ़ना बंद करें', te: 'చదవడం ఆపు'}) : t(`Read Instructions`, {hi: 'निर्देश सुनें', te: 'సూచనలు వినండి'})}
                    </button>

                    {/* First Aid Steps */}
                    <div style={{ backgroundColor: 'var(--triage-green-bg)', padding: '1.5rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--triage-green-border)' }}>
                      <h4 style={{ margin: '0 0 1rem 0', color: 'var(--triage-green-text)', fontSize: '1.1rem', fontWeight: 800 }}>
                        {t('First Aid Steps', { hi: 'प्राथमिक उपचार के चरण', te: 'ప్రథమ చికిత్స దశలు' })}
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {protocol.steps[audioLanguage].map((step, idx) => (
                          <li key={idx} style={{ color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6 }}>{step}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Suspect & Red Flags */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                      <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-base)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-light)' }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-primary)' }}>{t('When to Suspect:', { hi: 'लक्षण कब संदिग्ध समझें:', te: 'ఎప్పుడు అనుమానించాలి:' })}</h4>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          {protocol.suspect.map((s, idx) => <li key={idx}>{s}</li>)}
                        </ul>
                      </div>
                      
                      <div style={{ padding: '1.25rem', backgroundColor: 'var(--triage-red-bg)', borderRadius: 'var(--border-radius-sm)', border: '1px dashed var(--triage-red-border)' }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--color-error)' }}>{t('Critical Red Flags:', { hi: 'गंभीर चेतावनी के लक्षण:', te: 'క్లిష్టమైన హెచ్చరికలు:' })}</h4>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--color-error)', fontSize: '0.9rem', fontWeight: 600 }}>
                          {protocol.redFlags.map((r, idx) => <li key={idx}>{r}</li>)}
                        </ul>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmergencyProtocols;
