import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Thermometer, 
  Activity, 
  User, 
  Volume2, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft, 
  Sparkles,
  Clock,
  Check
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [patient, setPatient] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState(language);

  useEffect(() => {
    // Load patient data from localStorage
    const patients = JSON.parse(localStorage.getItem('asha_patients') || '[]');
    const foundPatient = patients.find(p => p.id === id);
    setPatient(foundPatient);

    // Sync audio language with global language setting
    setAudioLanguage(language);
  }, [id, language]);

  // Audio instructions playback
  const handleSpeakInstructions = () => {
    if (!patient || !patient.triageResult) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const triageResult = patient.triageResult;
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

    // Add first aid instructions in the active audioLanguage
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

  if (!patient) {
    return (
      <div className="app-layout-page">
        <Navbar />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
          <AlertTriangle size={48} style={{ color: 'var(--color-error)' }} />
          <h3>{t('Patient Case File Not Found', { hi: 'मरीज की फाइल नहीं मिली', te: 'రోగి ఫైల్ కనుగొనబడలేదు' })}</h3>
          <button onClick={() => navigate('/')} className="btn-primary">{t('Back to Dashboard', { hi: 'डैशबोर्ड पर वापस जाएं', te: 'డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి' })}</button>
        </div>
        <Footer />
      </div>
    );
  }

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

  const triageResult = patient.triageResult;
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

      <div className="patient-detail-page-container">
        
        {/* Back navigation control */}
        <div>
          <button 
            onClick={() => {
              window.speechSynthesis.cancel();
              navigate('/');
            }} 
            className="btn-secondary" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            {t('Back to Patients Log', { hi: 'मरीजों की सूची पर वापस जाएं', te: 'రోగుల జాబితాకు తిరిగి వెళ్లండి' })}
          </button>
        </div>

        {/* 1. Patient Profile Header Card */}
        <div className="patient-profile-card">
          <div className="patient-meta-avatar-info">
            <div className="patient-avatar-placeholder">
              <User size={32} />
            </div>
            <div className="patient-name-id-box">
              <h2 className="patient-name-txt">{patient.name}</h2>
              <span className="patient-uid-txt">{t('Case ID:', {hi: 'केस ID:', te: 'కేసు ID:'})} {patient.id} • {t('Registered:', {hi: 'दर्ज किया गया:', te: 'నమోదు చేయబడింది:'})} {patient.date}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span className={`severity-badge ${getSeverityBadgeClass(triageResult.triageColor)}`}>
              {triageResult.triageColor} {t('Priority', {hi: 'प्राथमिकता', te: 'ప్రాధాన్యత'})}
            </span>
            <span className={`sync-badge ${patient.syncStatus === 'synced' ? 'synced' : 'pending'}`}>
              {patient.syncStatus === 'synced' ? <Check size={12} /> : <Clock size={12} />}
              {patient.syncStatus === 'synced' ? t('Synced', { hi: 'सिंक हो गया', te: 'సింక్ చేయబడింది' }) : t('Offline Pending', { hi: 'ऑफ़लाइन - सिंक बाकी', te: 'ఆఫ్‌లైన్ - సింక్ పెండింగ్' })}
            </span>
          </div>
        </div>

        {/* 2. Patient Vitals Metrics Bar */}
        <div className="vitals-summary-bar">
          <div className="vital-summary-item">
            <span className="vital-item-lbl">{t('Age / Gender', { hi: 'उम्र / लिंग', te: 'వయస్సు / లింగం' })}</span>
            <span className="vital-item-val">{patient.age} {t('yrs', {hi: 'वर्ष', te: 'సంవత్సరాలు'})} / {patient.gender === 'Male' ? t('Male', {hi: 'पुरुष', te: 'మగ'}) : patient.gender === 'Female' ? t('Female', {hi: 'महिला', te: 'ఆడ'}) : t('Other', {hi: 'अन्य', te: 'ఇతర'})}</span>
          </div>
          <div className="vital-summary-item">
            <span className="vital-item-lbl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <Thermometer size={14} style={{ color: 'var(--primary-solid)' }} /> {t('Temperature', { hi: 'तापमान', te: 'ఉష్ణోగ్రత' })}
            </span>
            <span className="vital-item-val" style={{ color: parseFloat(patient.vitals.temperature) >= 100.4 ? 'var(--triage-orange-text)' : 'var(--text-primary)' }}>
              {patient.vitals.temperature}°F
            </span>
          </div>
          <div className="vital-summary-item">
            <span className="vital-item-lbl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <Heart size={14} style={{ color: 'var(--color-error)' }} /> {t('Heart Rate', { hi: 'हृदय गति', te: 'హృదయ స్పందన రేటు' })}
            </span>
            <span className="vital-item-val" style={{ color: (parseFloat(patient.vitals.heartRate) >= 120 || parseFloat(patient.vitals.heartRate) < 55) ? 'var(--triage-red-text)' : 'var(--text-primary)' }}>
              {patient.vitals.heartRate} BPM
            </span>
          </div>
          <div className="vital-summary-item">
            <span className="vital-item-lbl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <Activity size={14} style={{ color: 'var(--primary-accent)' }} /> {t('Blood Pressure', { hi: 'रक्तचाप', te: 'రక్తపోటు' })}
            </span>
            <span className="vital-item-val">
              {patient.vitals.systolic} / {patient.vitals.diastolic} <span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>mmHg</span>
            </span>
          </div>
        </div>

        {/* 3. Symptom Narrative Description */}
        <div className="result-section-card" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <h4 className="result-section-title">
            <User size={16} style={{ color: 'var(--primary-solid)' }} />
            {t('Symptom Narrative & complaints', { hi: 'लक्षण और शिकायतें', te: 'లక్షణాలు మరియు ఫిర్యాదులు' })}
          </h4>
          <p className="result-text-block" style={{ fontStyle: 'italic', color: 'var(--text-primary)' }}>
            "{patient.symptoms}"
          </p>
        </div>

        {/* 4. Triage Analysis & Recommendations */}
        <div className="result-triage-panel">
          {/* Urgent Warning Banner */}
          <div className={`result-urgency-banner ${getSeverityBadgeClass(triageResult.triageColor)}`}>
            <div style={{ marginTop: '0.25rem' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="urgency-title-text" style={{ fontSize: '1.25rem' }}>
                {t('PRIORITY DIAGNOSTIC:', {hi: 'प्राथमिकता जांच:', te: 'ప్రాధాన్యత నిర్ధారణ:'})} {triageResult.triageColor}
              </h3>
              <p className="urgency-description" style={{ fontSize: '0.925rem' }}>
                {language === 'hi' && triageResult.translatedSummary.hi ? triageResult.translatedSummary.hi :
                 language === 'te' && triageResult.translatedSummary.te ? triageResult.translatedSummary.te :
                 (typeof triageResult.translatedSummary === 'string' ? triageResult.translatedSummary : triageResult.translatedSummary.en)}
              </p>
            </div>
          </div>

          {/* Audio broadcast trigger */}
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

          {/* Clinical analysis */}
          <div className="result-section-card" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <h4 className="result-section-title">
              <Sparkles size={16} style={{ color: 'var(--primary-solid)' }} />
              {t('Clinical Diagnostics & Possibilities', {hi: 'क्लीनिकल विश्लेषण और संभावनाएं', te: 'క్లినికల్ విశ్లేషణ మరియు అవకాశాలు'})}
            </h4>
            <p className="result-text-block">
              {getTranslation(triageResult.conditionPossibilities, language)}
            </p>
            {triageResult.isFallback && (
              <div style={{ fontSize: '0.75rem', color: 'var(--triage-orange-text)', marginTop: '0.5rem', fontWeight: '600' }}>
                * {t('Logged using Local offline diagnostic engine.', {hi: 'स्थानीय ऑफ़लाइन इंजन का उपयोग करके दर्ज किया गया।', te: 'స్థానిక ఆఫ్‌లైన్ ఇంజిన్‌ని ఉపయోగించి లాగ్ చేయబడింది.'})}
              </div>
            )}
          </div>

          {/* First aid instructions */}
          <div className="result-section-card" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <h4 className="result-section-title" style={{ color: 'var(--triage-green-text)' }}>
              <CheckCircle size={16} />
              {t('Immediate First Aid & Treatment Plan', {hi: 'तत्काल प्राथमिक उपचार और कदम', te: 'తక్షణ ప్రథమ చికిత్స మరియు చర్యలు'})}
            </h4>
            <ul className="result-list">
              {getTranslationArray(triageResult.firstAidInstructions, language).map((ins, idx) => (
                <li key={idx}>{ins}</li>
              ))}
            </ul>
          </div>

          {/* Critical Red Flags warning */}
          <div className="result-section-card" style={{ backgroundColor: 'var(--bg-surface)', borderLeft: '4px solid var(--color-error)' }}>
            <h4 className="result-section-title" style={{ color: 'var(--color-error)' }}>
              <AlertTriangle size={16} />
              {t('Warning Symptoms (Red Flags to Monitor)', {hi: 'गंभीर चेतावनी के लक्षण (Red Flags)', te: 'చూడవలసిన క్లిష్టమైన హెచ్చరికలు'})}
            </h4>
            <ul className="result-list">
              {getTranslationArray(triageResult.redFlags, language).map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default PatientDetail;
