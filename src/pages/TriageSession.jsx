import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Thermometer, 
  User, 
  Volume2, 
  Mic, 
  MicOff, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { runAITriage } from '../utils/geminiApi';
import { useLanguage } from '../contexts/LanguageContext';

// Predefined symptoms for quick selection/testing
const QUICK_SYMPTOMS = [
  { label: "Chest Pain & Left Arm Numbness (RED)", text: "Patient is experiencing severe compressing chest pain that radiates to the left arm and neck. Shortness of breath is present." },
  { label: "High Fever & Stiff Neck (RED)", text: "Patient has a high fever of 103.5 F, severe headache, and is complaining of a stiff neck when trying to look down." },
  { label: "Vomiting Everything & Weakness (ORANGE)", text: "Child is running a high fever, is vomiting everything she eats or drinks, and shows signs of extreme weakness and dry mouth." },
  { label: "Snake Bite on Ankle (RED)", text: "Patient was bitten by an unidentified snake on the left ankle 30 minutes ago. There is swelling and moderate pain." },
  { label: "Persistent Diarrhea (YELLOW)", text: "Patient has passed watery stools 5 times since morning. Mild stomach cramps, but is able to drink ORS water and is stable." },
  { label: "Mild Cough & Cold (GREEN)", text: "Patient has a mild cough, runny nose, and throat irritation for 2 days. No breathing difficulties, no fever." }
];

const TriageSession = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  // Triage configuration loaded from localStorage
  const [apiKey, setApiKey] = useState('');
  const [offlineMode, setOfflineMode] = useState(false);

  // Step state
  const [activeStep, setActiveStep] = useState(1); // 1: Vitals, 2: Symptoms, 3: Results

  // Patient Info & Vitals State
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [temperature, setTemperature] = useState('98.6');
  const [heartRate, setHeartRate] = useState('80');
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');

  // Symptoms State
  const [symptoms, setSymptoms] = useState('');
  
  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Diagnostic State
  const [loading, setLoading] = useState(false);
  const [triageResult, setTriageResult] = useState(null);
  
  // Audio playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState('en');

  useEffect(() => {
    // Load config
    setApiKey(localStorage.getItem('gemini_api_key') || '');
    setAudioLanguage(language);
    setOfflineMode(localStorage.getItem('triage_offline_mode') === 'true');

    // Initialize Web Speech Recognition API if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN'; // Indian English accent fits well, can also do hi-IN

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms((prev) => (prev ? prev + " " + transcript : transcript));
        setIsListening(false);
      };

      rec.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  // Voice recognition toggle
  const toggleSpeechRecognition = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please type symptoms manually.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  // Quick symptom autocomplete handler
  const handleQuickSymptom = (text) => {
    setSymptoms(text);
    // Auto-adjust vitals to match symptoms for realistic demo
    if (text.includes("Chest Pain")) {
      setHeartRate("110");
      setSystolic("145");
      setDiastolic("95");
      setTemperature("98.6");
    } else if (text.includes("Stiff Neck")) {
      setTemperature("103.2");
      setHeartRate("105");
      setSystolic("115");
      setDiastolic("75");
    } else if (text.includes("Vomiting Everything")) {
      setTemperature("101.8");
      setHeartRate("115");
      setSystolic("95");
      setDiastolic("60");
    } else if (text.includes("Snake Bite")) {
      setHeartRate("120");
      setSystolic("110");
      setDiastolic("70");
      setTemperature("98.9");
    } else if (text.includes("Diarrhea")) {
      setTemperature("99.8");
      setHeartRate("95");
      setSystolic("108");
      setDiastolic("68");
    } else if (text.includes("Mild Cough")) {
      setTemperature("98.8");
      setHeartRate("76");
      setSystolic("120");
      setDiastolic("80");
    }
  };

  // Run triage assessment
  const handleDiagnose = async () => {
    if (!patientName.trim()) {
      alert("Please enter the patient's name.");
      return;
    }
    if (!age || parseFloat(age) <= 0) {
      alert("Please enter a valid age.");
      return;
    }
    if (!symptoms.trim()) {
      alert("Please describe patient symptoms or select a quick option.");
      return;
    }

    setLoading(true);
    setTriageResult(null);

    const vitals = {
      age,
      gender,
      temperature,
      heartRate,
      systolic,
      diastolic
    };

    // If offlineMode is toggled, force runAITriage to bypass API key
    const effectiveKey = offlineMode ? null : apiKey;

    const result = await runAITriage(vitals, symptoms, effectiveKey);
    setTriageResult(result);
    setLoading(false);
    setActiveStep(3); // Go to results step
  };

  // Audio Guidance Speech Synthesis
  const handleSpeakInstructions = () => {
    if (!triageResult) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    // Pick translated text based on selected audio language setting
    let textToSpeak = "";
    let speechLang = "en-US";

    const summary = triageResult.translatedSummary;
    if (audioLanguage === 'hi' && summary.hi) {
      textToSpeak = summary.hi;
      speechLang = "hi-IN";
    } else if (audioLanguage === 'te' && summary.te) {
      textToSpeak = summary.te;
      speechLang = "te-IN";
    } else {
      textToSpeak = typeof summary === 'string' ? summary : summary.en;
      speechLang = "en-US";
    }

    // Add first aid instructions to read out
    const firstAidList = getTranslationArray(triageResult.firstAidInstructions, audioLanguage);
    if (firstAidList && firstAidList.length > 0) {
      const firstAidIntro = audioLanguage === 'hi' ? "। प्राथमिक उपचार के नियम: " : (audioLanguage === 'te' ? "। ప్రథమ చికిత్స సూచనలు: " : ". First aid instructions: ");
      textToSpeak += firstAidIntro + firstAidList.join(". ");
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = speechLang;
    
    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Save case details in localStorage patient registry
  const handleSaveCase = () => {
    if (!triageResult) return;

    const newCase = {
      id: 'PAT-' + Math.floor(100000 + Math.random() * 900000),
      name: patientName,
      age: parseInt(age),
      gender: gender,
      vitals: {
        temperature,
        heartRate,
        systolic,
        diastolic
      },
      symptoms: symptoms,
      triageResult: triageResult,
      date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format
      syncStatus: offlineMode ? 'pending' : 'synced'
    };

    const existingPatients = JSON.parse(localStorage.getItem('asha_patients') || '[]');
    existingPatients.unshift(newCase); // add new case at the beginning
    localStorage.setItem('asha_patients', JSON.stringify(existingPatients));

    // Cancel speech if running
    window.speechSynthesis.cancel();

    // Navigate back to home
    navigate('/');
  };

  // Safe translation helpers
  const getTranslation = (field, lang) => {
    if (!field) return "";
    if (typeof field === 'string') return field;
    return field[lang] || field.en || "";
  };

  const getTranslationArray = (field, lang) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    return field[lang] || field.en || [];
  };

  // Render triage status details
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

      <div className="triage-session-container">
        {/* Back Button */}
        <div style={{ marginBottom: '1.25rem' }}>
          <button 
            onClick={() => {
              window.speechSynthesis.cancel();
              navigate('/');
            }} 
            className="btn-secondary" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            {t('Cancel Triage', {hi: 'रद्द करें', te: 'రద్దు చేయండి'})}
          </button>
        </div>

        <div className="triage-card">
          {/* Steps Breadcrumbs */}
          <div className="triage-steps-indicator">
            <div className={`triage-step-tab ${activeStep === 1 ? 'active' : ''} ${activeStep > 1 ? 'completed' : ''}`}>
              <div className="step-number-bubble">1</div>
              <span>{t('Patient Vitals', {hi: 'मरीज के वाइटल्स', te: 'రోగి ప్రాణాధారాలు'})}</span>
            </div>
            <div className={`triage-step-tab ${activeStep === 2 ? 'active' : ''} ${activeStep > 2 ? 'completed' : ''}`}>
              <div className="step-number-bubble">2</div>
              <span>{t('Symptoms Narrative', {hi: 'लक्षण विवरण', te: 'లక్షణాల వివరణ'})}</span>
            </div>
            <div className={`triage-step-tab ${activeStep === 3 ? 'active' : ''}`}>
              <div className="step-number-bubble">3</div>
              <span>{t('Triage Assessment', {hi: 'जांच परिणाम', te: 'ట్రయాజ్ అంచనా'})}</span>
            </div>
          </div>

          <div className="triage-card-body">
            
            {/* STEP 1: VITALS ENTRY */}
            {activeStep === 1 && (
              <div className="triage-form-grid">
                <div className="triage-input-wrapper">
                  <label className="field-label">{t('Patient Full Name *', {hi: 'मरीज का पूरा नाम *', te: 'రోగి పూర్తి పేరు *'})}</label>
                  <input
                    type="text"
                    placeholder={t("e.g. Kamala Devi", {hi: "उदा. कमला देवी", te: "ఉదా. కమల దేవి"})}
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="triage-input-element"
                  />
                </div>

                <div className="triage-input-wrapper">
                  <label className="field-label">{t('Age (in Years) *', {hi: 'उम्र (वर्षों में) *', te: 'వయస్సు (సంవత్సరాల్లో) *'})}</label>
                  <input
                    type="number"
                    placeholder="e.g. 45"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="triage-input-element"
                  />
                </div>

                <div className="triage-input-wrapper">
                  <label className="field-label">{t('Gender', {hi: 'लिंग', te: 'లింగం'})}</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="triage-select-element"
                    style={{ height: '42px' }}
                  >
                    <option value="Female">{t('Female', {hi: 'महिला', te: 'ఆడ'})}</option>
                    <option value="Male">{t('Male', {hi: 'पुरुष', te: 'మగ'})}</option>
                    <option value="Other">{t('Other', {hi: 'अन्य', te: 'ఇతర'})}</option>
                  </select>
                </div>

                <div className="triage-input-wrapper">
                  <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Thermometer size={16} style={{ color: 'var(--primary-solid)' }} />
                    {t('Temperature (°F)', {hi: 'तापमान (°F)', te: 'ఉష్ణోగ్రత (°F)'})}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="98.6"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="triage-input-element"
                  />
                </div>

                <div className="triage-input-wrapper">
                  <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Heart size={16} style={{ color: 'var(--color-error)' }} />
                    {t('Heart Rate (BPM)', {hi: 'हृदय गति (BPM)', te: 'హృదయ స్పందన రేటు (BPM)'})}
                  </label>
                  <input
                    type="number"
                    placeholder="80"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    className="triage-input-element"
                  />
                </div>

                <div className="triage-input-wrapper">
                  <label className="field-label">{t('Blood Pressure (Systolic / Diastolic)', {hi: 'रक्तचाप (सिस्टोलिक / डायस्टोलिक)', te: 'రక్తపోటు (సిస్టోలిక్ / డయాస్టొలిక్)'})}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="number"
                      placeholder="120"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      className="triage-input-element"
                      style={{ textAlign: 'center' }}
                    />
                    <span>/</span>
                    <input
                      type="number"
                      placeholder="80"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      className="triage-input-element"
                      style={{ textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>mmHg</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SYMPTOMS ENTRY */}
            {activeStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="triage-input-wrapper full-width">
                  <label className="field-label">{t('Describe Symptoms / Complaints *', {hi: 'लक्षण / समस्या का वर्णन करें *', te: 'లక్షణాలు / ఫిర్యాదును వివరించండి *'})}</label>
                  <textarea
                    placeholder={t("Describe how the patient feels, pain description, duration, and other observations...", {hi: "बताएं मरीज को कैसा लग रहा है, दर्द का प्रकार, अवधि और अन्य बातें...", te: "రోగి ఎలా భావిస్తున్నాడో వివరించండి, నొప్పి, వ్యవధి మరియు ఇతర పరిశీలనలు..."})}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="triage-textarea-element"
                  />
                  
                  {/* Voice assistant trigger */}
                  <div className="voice-input-row">
                    <button
                      type="button"
                      onClick={toggleSpeechRecognition}
                      className={`btn-voice-trigger ${isListening ? 'listening' : ''}`}
                    >
                      {isListening ? (
                        <>
                          <MicOff size={16} />
                          {t('Listening... Tap to stop', {hi: 'सुन रहा है... रोकने के लिए टैप करें', te: 'వింటున్నది... ఆపడానికి నొక్కండి'})}
                        </>
                      ) : (
                        <>
                          <Mic size={16} />
                          {t('Voice-input Symptoms (Speech-to-Text)', {hi: 'बोलकर लक्षण दर्ज करें', te: 'వాయిస్ ద్వారా లక్షణాలను నమోదు చేయండి'})}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick select demonstration helpers */}
                <div style={{ marginTop: '0.5rem' }}>
                  <label className="field-label" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                    {t('Quick-Fill for Clinical Severity Testing:', {hi: 'क्लीनिकल गंभीरता परीक्षण के लिए त्वरित विकल्प:', te: 'క్లినికల్ తీవ్రత పరీక్ష కోసం శీఘ్ర ఎంపికలు:'})}
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {QUICK_SYMPTOMS.map((qs, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleQuickSymptom(qs.text)}
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderRadius: '4px' }}
                      >
                        {qs.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: TRIAGE RESULTS */}
            {activeStep === 3 && triageResult && (
              <div className="result-triage-panel">
                
                {/* 1. Urgency Level Banner */}
                <div className={`result-urgency-banner ${getSeverityBadgeClass(triageResult.triageColor)}`}>
                  <div style={{ marginTop: '0.25rem' }}>
                    <AlertTriangle size={28} />
                  </div>
                  <div>
                    <h3 className="urgency-title-text">
                      {t('PRIORITY LEVEL:', {hi: 'प्राथमिकता स्तर:', te: 'ప్రాధాన్యత స్థాయి:'})} {triageResult.triageColor}
                    </h3>
                    <p className="urgency-description">
                      {language === 'hi' && triageResult.translatedSummary.hi ? triageResult.translatedSummary.hi :
                       language === 'te' && triageResult.translatedSummary.te ? triageResult.translatedSummary.te :
                       (typeof triageResult.translatedSummary === 'string' ? triageResult.translatedSummary : triageResult.translatedSummary.en)}
                    </p>
                  </div>
                </div>

                {/* 2. Audio Broadcast Assist */}
                <div className="result-audio-player-bar" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Volume2 size={20} />
                      <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                        {isPlayingAudio ? 'Speaking instructions...' : 'Voice Assistant / ऑडियो मार्गदर्शिका'}
                      </span>
                    </div>
                    <button onClick={handleSpeakInstructions} className="btn-speak-instruction">
                      {isPlayingAudio ? 'Stop Speech / बंद करें' : 'Play Audio / आवाज सुनें'}
                    </button>
                  </div>
                  
                  {/* Inline Language Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid rgba(13, 148, 136, 0.15)', paddingTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary-hover)' }}>Audio Language / आवाज की भाषा:</span>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button 
                        type="button"
                        onClick={() => {
                          window.speechSynthesis.cancel();
                          setIsPlayingAudio(false);
                          setAudioLanguage('en');
                        }}
                        className="btn-secondary"
                        style={{ 
                          padding: '0.25rem 0.5rem', 
                          fontSize: '0.75rem', 
                          borderRadius: '4px',
                          backgroundColor: audioLanguage === 'en' ? 'var(--primary-solid)' : '',
                          color: audioLanguage === 'en' ? '#fff' : 'var(--text-secondary)',
                          border: audioLanguage === 'en' ? 'none' : '1px solid var(--border-color)',
                          cursor: 'pointer'
                        }}
                      >
                        English
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          window.speechSynthesis.cancel();
                          setIsPlayingAudio(false);
                          setAudioLanguage('hi');
                        }}
                        className="btn-secondary"
                        style={{ 
                          padding: '0.25rem 0.5rem', 
                          fontSize: '0.75rem', 
                          borderRadius: '4px',
                          backgroundColor: audioLanguage === 'hi' ? 'var(--primary-solid)' : '',
                          color: audioLanguage === 'hi' ? '#fff' : 'var(--text-secondary)',
                          border: audioLanguage === 'hi' ? 'none' : '1px solid var(--border-color)',
                          cursor: 'pointer'
                        }}
                      >
                        हिन्दी (Hindi)
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          window.speechSynthesis.cancel();
                          setIsPlayingAudio(false);
                          setAudioLanguage('te');
                        }}
                        className="btn-secondary"
                        style={{ 
                          padding: '0.25rem 0.5rem', 
                          fontSize: '0.75rem', 
                          borderRadius: '4px',
                          backgroundColor: audioLanguage === 'te' ? 'var(--primary-solid)' : '',
                          color: audioLanguage === 'te' ? '#fff' : 'var(--text-secondary)',
                          border: audioLanguage === 'te' ? 'none' : '1px solid var(--border-color)',
                          cursor: 'pointer'
                        }}
                      >
                        తెలుగు (Telugu)
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Condition Clinical Summary */}
                <div className="result-section-card">
                  <h4 className="result-section-title">
                    <Sparkles size={16} style={{ color: 'var(--primary-solid)' }} />
                    {t('Clinical Analysis & Possibilities', {hi: 'क्लीनिकल विश्लेषण और संभावनाएं', te: 'క్లినికల్ విశ్లేషణ మరియు అవకాశాలు'})}
                  </h4>
                  <p className="result-text-block">
                    {getTranslation(triageResult.conditionPossibilities, language)}
                  </p>
                  {triageResult.isFallback && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.75rem', color: 'var(--triage-orange-text)', fontSize: '0.75rem', fontWeight: '600' }}>
                      <RefreshCw size={12} className="loading-spinner" />
                      {t('Computed locally (Offline Mode Active)', {hi: 'स्थानीय रूप से गणना की गई (ऑफ़लाइन मोड सक्रिय)', te: 'స్థానికంగా లెక్కించబడింది (ఆఫ్‌లైన్ మోడ్ యాక్టివ్)'})}
                    </div>
                  )}
                </div>

                {/* 4. Action Steps & First Aid */}
                <div className="result-section-card">
                  <h4 className="result-section-title" style={{ color: 'var(--triage-green-text)' }}>
                    <CheckCircle size={16} />
                    {t('Immediate First Aid & Action Steps', {hi: 'तत्काल प्राथमिक उपचार और कदम', te: 'తక్షణ ప్రథమ చికిత్స మరియు చర్యలు'})}
                  </h4>
                  <ul className="result-list">
                    {getTranslationArray(triageResult.firstAidInstructions, language).map((ins, idx) => (
                      <li key={idx}>{ins}</li>
                    ))}
                  </ul>
                </div>

                {/* 5. Warning Flags (Red Flags) */}
                <div className="result-section-card" style={{ borderLeft: '4px solid var(--color-error)' }}>
                  <h4 className="result-section-title" style={{ color: 'var(--color-error)' }}>
                    <AlertTriangle size={16} />
                    {t('Critical Red Flags to Watch', {hi: 'गंभीर चेतावनी के लक्षण (Red Flags)', te: 'చూడవలసిన క్లిష్టమైన హెచ్చరికలు'})}
                  </h4>
                  <ul className="result-list">
                    {getTranslationArray(triageResult.redFlags, language).map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* DIAGNOSING LOADING STATE */}
            {loading && (
              <div className="loader-layout-wrapper">
                <RefreshCw size={36} className="loading-spinner" />
                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: '700' }}>
                  {t('Analyzing Vitals & Narrative...', {hi: 'वाइटल्स और विवरण का विश्लेषण हो रहा है...', te: 'ప్రాణాధారాలు మరియు వివరాలను విశ్లేషిస్తోంది...'})}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
                  {offlineMode 
                    ? t("Running local clinical triage decision trees...", {hi: "स्थानीय क्लीनिकल ट्राइएज चल रहा है...", te: "స్థానిక క్లినికల్ ట్రయాజ్ నడుస్తోంది..."})
                    : t("Connecting to Gemini AI Clinical Assistant...", {hi: "जेमिनी एआई क्लीनिकल असिस्टेंट से जुड़ रहा है...", te: "జెమిని ఏఐ క్లినికల్ అసిస్టెంట్‌కి కనెక్ట్ అవుతోంది..."})}
                </p>
              </div>
            )}

          </div>

          {/* Footer Controls */}
          {!loading && (
            <div className="triage-card-footer">
              <div>
                {activeStep > 1 && activeStep < 3 && (
                  <button 
                    onClick={() => setActiveStep(activeStep - 1)} 
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <ChevronLeft size={16} />
                    {t('Back', {hi: 'पीछे', te: 'వెనుకకు'})}
                  </button>
                )}
              </div>
              
              <div>
                {activeStep === 1 && (
                  <button 
                    onClick={() => {
                      if (!patientName.trim() || !age) {
                        alert(t("Please fill in the Patient Name and Age before continuing.", {hi: "कृपया आगे बढ़ने से पहले मरीज का नाम और उम्र भरें।", te: "కొనసాగడానికి ముందు దయచేసి రోగి పేరు మరియు వయస్సును పూరించండి."}));
                        return;
                      }
                      setActiveStep(2);
                    }} 
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    {t('Continue', {hi: 'आगे बढ़ें', te: 'కొనసాగించు'})}
                    <ChevronRight size={16} />
                  </button>
                )}

                {activeStep === 2 && (
                  <button 
                    onClick={handleDiagnose} 
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary-hover)' }}
                  >
                    <Sparkles size={16} />
                    {t('Run Clinical Triage', {hi: 'क्लीनिकल ट्राइएज चलाएं', te: 'క్లినికల్ ట్రయాజ్ రన్ చేయండి'})}
                  </button>
                )}

                {activeStep === 3 && (
                  <button 
                    onClick={handleSaveCase} 
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-success)' }}
                  >
                    <Save size={16} />
                    {t('Save & Register Case', {hi: 'सहेजें और केस दर्ज करें', te: 'సేవ్ చేయండి & కేసును నమోదు చేయండి'})}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TriageSession;
