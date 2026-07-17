import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Globe, WifiOff, Wifi, Save, ArrowLeft, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const Settings = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const [apiKey, setApiKey] = useState('');
  const [offlineMode, setOfflineMode] = useState(false);
  
  // UI feedback states
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    const savedOffline = localStorage.getItem('triage_offline_mode') === 'true';

    setApiKey(savedKey);
    setOfflineMode(savedOffline);
    setOfflineMode(savedOffline);
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('gemini_api_key', apiKey.trim());
    localStorage.setItem('triage_offline_mode', offlineMode ? 'true' : 'false');
    localStorage.setItem('triage_offline_mode', offlineMode ? 'true' : 'false');
    
    // Dispatch a custom event to notify Navbar of connection state changes
    window.dispatchEvent(new Event('storage'));

    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 2000);
  };

  return (
    <div className="app-layout-page">
      <Navbar />
      
      <div className="settings-page-wrapper">
        {/* Back navigation */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button onClick={() => navigate('/')} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} />
            {t('Back to Dashboard', { hi: 'डैशबोर्ड पर वापस जाएं', te: 'డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి' })}
          </button>
        </div>

        <div className="settings-card">
          <div className="section-header">
            <h2 className="section-title">{t('AshaTriage Settings', { hi: 'आशा ट्राइएज सेटिंग्स', te: 'ఆశా ట్రయాజ్ సెట్టింగ్‌లు' })}</h2>
            <p className="dashboard-subtitle" style={{ marginTop: '0.25rem' }}>
              {t('Configure clinical triage parameters, regional language, and network simulation.', { hi: 'क्लीनिकल ट्राइएज, भाषा और नेटवर्क कॉन्फ़िगर करें।', te: 'క్లినికల్ ట్రయాజ్, భాష మరియు నెట్‌వర్క్‌ను కాన్ఫిగర్ చేయండి.' })}
            </p>
          </div>

          {showSavedToast && (
            <div className="login-alert-error" style={{ backgroundColor: 'var(--triage-green-bg)', borderColor: 'var(--triage-green-border)', color: 'var(--triage-green-text)' }}>
              <CheckCircle size={18} />
              <span>{t('Configuration saved successfully!', { hi: 'सेटिंग्स सफलतापूर्वक सहेजी गईं!', te: 'సెట్టింగ్‌లు విజయవంతంగా సేవ్ చేయబడ్డాయి!' })}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 1. Gemini API Key */}
            <div className="settings-field-group">
              <label className="settings-field-label">
                <Key size={18} className="brand-icon" />
                {t('Gemini API Key', { hi: 'जेमिनी API कुंजी (Gemini API Key)', te: 'జెమిని API కీ' })}
              </label>
              <p className="settings-field-desc">
                {t('Enter your Google AI Gemini API Key. This enables deep diagnostic reasoning, red flag checks, and translations.', { hi: 'अपनी Google AI Gemini API कुंजी दर्ज करें। यह उन्नत निदान और अनुवाद को सक्षम बनाता है।', te: 'మీ Google AI జెమిని API కీని నమోదు చేయండి.' })}
              </p>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="field-text-input"
                style={{ marginTop: '0.5rem' }}
              />
              <p className="settings-field-desc" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {t('Note: If left blank, the system automatically uses the high-fidelity local clinical expert rules.', { hi: 'नोट: यदि खाली छोड़ दिया जाता है, तो सिस्टम स्थानीय क्लीनिकल नियमों का उपयोग करेगा।', te: 'గమనిక: ఖాళీగా వదిలేస్తే, సిస్టమ్ స్థానిక నియమాలను ఉపయోగిస్తుంది.' })}
              </p>
            </div>



            {/* 2. Offline Mode Simulation */}
            <div className="settings-field-group">
              <label className="settings-field-label">
                {offlineMode ? <WifiOff size={18} style={{ color: 'var(--triage-orange-text)' }} /> : <Wifi size={18} style={{ color: 'var(--color-success)' }} />}
                {t('Simulated Offline Mode', { hi: 'सिम्युलेटेड ऑफ़लाइन मोड', te: 'సిమ్యులేటెడ్ ఆఫ్‌లైన్ మోడ్' })}
              </label>
              <p className="settings-field-desc">
                {t('Simulate operating in remote hilly or rural terrain where cellular networks are unavailable. Triage will run fully client-side using local decision trees.', { hi: 'ग्रामीण क्षेत्रों की तरह बिना इंटरनेट के काम करने का परीक्षण करें।', te: 'గ్రామీణ ప్రాంతాల వలె ఇంటర్నెట్ లేకుండా పని చేయడాన్ని పరీక్షించండి.' })}
              </p>
              
              <label className="switch-control-label">
                <input
                  type="checkbox"
                  checked={offlineMode}
                  onChange={(e) => setOfflineMode(e.target.checked)}
                  className="switch-checkbox"
                />
                <div className="switch-slider-track">
                  <div className="switch-slider-thumb"></div>
                </div>
                <span className="field-label" style={{ fontWeight: '500' }}>
                  {offlineMode ? t('Simulated Offline Enabled (Local Engine only)', { hi: 'ऑफ़लाइन सक्रिय (केवल स्थानीय इंजन)', te: 'ఆఫ్‌లైన్ ప్రారంభించబడింది' }) : t('Auto-network (Online Gemini & Local fallback)', { hi: 'ऑटो-नेटवर्क (जेमिनी ऑनलाइन)', te: 'ఆటో-నెట్‌వర్క్' })}
                </span>
              </label>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ minWidth: '140px' }}>
                <Save size={16} />
                {t('Save Settings', { hi: 'सेटिंग्स सहेजें', te: 'సెట్టింగ్‌లను సేవ్ చేయండి' })}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;
