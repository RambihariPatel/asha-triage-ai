import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  ArrowUpDown, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  Users, 
  Activity, 
  Check
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

// Initial mock data to prepopulate on first load
const INITIAL_PATIENTS = [
  {
    id: 'PAT-829402',
    name: 'Suresh Kumar',
    age: 52,
    gender: 'Male',
    vitals: { temperature: '98.6', heartRate: '110', systolic: '145', diastolic: '95' },
    symptoms: 'Patient is experiencing severe compressing chest pain that radiates to the left arm and neck. Shortness of breath is present.',
    triageResult: {
      triageColor: 'RED',
      conditionPossibilities: 'High suspicion of Acute Coronary Syndrome (Myocardial Infarction / Heart Attack).',
      firstAidInstructions: [
        'Keep patient calm, absolutely sitting or resting.',
        'Do not let them walk or climb stairs.',
        'If not allergic, chew an aspirin tablet immediately.',
        'Prepare for immediate transfer to tertiary cardiac care center.'
      ],
      redFlags: ['Loss of consciousness', 'Gasping for breath', 'Profuse sweating & cold skin'],
      translatedSummary: {
        en: 'RED Status: Emergency cardiac chest pain. Urgent intervention required.',
        hi: 'गंभीर स्थिति (RED): दिल का दौरा पड़ने की आशंका। मरीज को तुरंत आपातकालीन चिकित्सा सहायता प्रदान करें।',
        te: 'తీవ్రమైన పరిస్థితి (RED): గుండెపోటు అనుమానం. రోగిని వెంటనే అత్యవసర చికిత్సకు తరలించండి.'
      }
    },
    date: '2026-07-16',
    syncStatus: 'synced'
  },
  {
    id: 'PAT-205938',
    name: 'Meena Patel',
    age: 28,
    gender: 'Female',
    vitals: { temperature: '103.2', heartRate: '105', systolic: '115', diastolic: '75' },
    symptoms: 'Patient has a high fever of 103.2 F, severe throbbing headache, and complains of a stiff neck when looking down.',
    triageResult: {
      triageColor: 'RED',
      conditionPossibilities: 'High risk of acute meningitis or central nervous system infection.',
      firstAidInstructions: [
        'Place cold damp cloths on forehead to reduce fever.',
        'Keep in a quiet, dark room to minimize photophobia.',
        'Keep hydrated with small sips of water.',
        'Administer antipyretic (paracetamol) if allowed.'
      ],
      redFlags: ['Altered mental state or confusion', 'Seizure onset', 'Purple body spots'],
      translatedSummary: {
        en: 'RED Status: Stiff neck + high fever suggests meningitis risk. Immediate physician consult.',
        hi: 'गंभीर स्थिति (RED): गर्दन में अकड़न और तेज बुखार दिमागी बुखार (meningitis) का संकेत हो सकता है। तुरंत अस्पताल ले जाएं।',
        te: 'తీవ్రమైన పరిస్థితి (RED): మెడ బిగుతుగా ఉండటం మరియు అధిక జ్వరం మెనింజైటిస్‌ను సూచించవచ్చు. వెంటనే ఆసుపత్రికి తరలించండి.'
      }
    },
    date: '2026-07-17',
    syncStatus: 'pending' // Simulated offline pending case
  },
  {
    id: 'PAT-495029',
    name: 'Raju Prasad',
    age: 4,
    gender: 'Male',
    vitals: { temperature: '101.8', heartRate: '115', systolic: '95', diastolic: '60' },
    symptoms: 'Child is running a high fever, is vomiting everything she eats or drinks, and shows signs of extreme weakness and dry mouth.',
    triageResult: {
      triageColor: 'ORANGE',
      conditionPossibilities: 'Severe dehydration due to acute gastroenteritis/fever. High risk in pediatric patient.',
      firstAidInstructions: [
        'Attempt small, frequent sips of ORS (Oral Rehydration Salts).',
        'Use paracetamol syrup for fever control.',
        'Keep child cool by sponge bath.',
        'Do not force solid foods.'
      ],
      redFlags: ['Sunken eyes', 'Inability to drink or nurse', 'Extreme lethargy or unconsciousness'],
      translatedSummary: {
        en: 'ORANGE Status: High fever and vomiting in child with dehydration signs. Early triage needed.',
        hi: 'अति गंभीर (ORANGE): बच्चे में बुखार और लगातार उल्टी होना निर्जलीकरण (dehydration) का खतरा है। त्वरित उपचार दें।',
        te: 'తీవ్రత (ORANGE): పిల్లల్లో జ్వరం మరియు నిరంతర వాంతులు నిర్జలీకరణ ప్రమాదాన్ని పెంచుతాయి. త్వరగా డాక్టర్‌ని సంప్రదించండి.'
      }
    },
    date: '2026-07-15',
    syncStatus: 'synced'
  },
  {
    id: 'PAT-104928',
    name: 'Geeta Bai',
    age: 60,
    gender: 'Female',
    vitals: { temperature: '98.8', heartRate: '76', systolic: '120', diastolic: '80' },
    symptoms: 'Patient has a mild cough, runny nose, and throat irritation for 2 days. No breathing difficulties, no fever.',
    triageResult: {
      triageColor: 'GREEN',
      conditionPossibilities: 'Common cold / mild upper respiratory tract irritation.',
      firstAidInstructions: [
        'Recommend warm saltwater gargles 3-4 times a day.',
        'Advise absolute rest and drinking warm fluids (herbal teas, warm water).',
        'Monitor temperature and breathing.'
      ],
      redFlags: ['Development of chest pain', 'Breathing difficulty', 'Fever develops above 101F'],
      translatedSummary: {
        en: 'GREEN Status: Mild cold/respiratory symptoms. Stable home-care management.',
        hi: 'सामान्य (GREEN): हल्का सर्दी-जुकाम। मरीज स्थिर है, आराम करें और गुनगुना पानी पिएं।',
        te: 'సాధారణం (GREEN): తేలికపాటి జలుబు. విశ్రాంతి తీసుకోండి మరియు వేడి నీరు తాగండి.'
      }
    },
    date: '2026-07-17',
    syncStatus: 'synced'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Patients registry state
  const [patients, setPatients] = useState([]);
  
  // UI filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // desc: Newest first, asc: Oldest first
  const [currentPage, setCurrentPage] = useState(1);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [syncError, setSyncError] = useState('');

  // 1. Initialize registry on mount
  useEffect(() => {
    let localPatients = localStorage.getItem('asha_patients');
    if (!localPatients) {
      localStorage.setItem('asha_patients', JSON.stringify(INITIAL_PATIENTS));
      setPatients(INITIAL_PATIENTS);
    } else {
      setPatients(JSON.parse(localPatients));
    }
  }, []);

  // 2. Metrics calculation
  const totalTriaged = patients.length;
  const emergencyCases = patients.filter(p => p.triageResult.triageColor === 'RED' || p.triageResult.triageColor === 'ORANGE').length;
  const stableCases = patients.filter(p => p.triageResult.triageColor === 'YELLOW' || p.triageResult.triageColor === 'GREEN').length;
  const pendingSync = patients.filter(p => p.syncStatus === 'pending').length;

  // Triage count break downs
  const redCount = patients.filter(p => p.triageResult.triageColor === 'RED').length;
  const orangeCount = patients.filter(p => p.triageResult.triageColor === 'ORANGE').length;
  const yellowCount = patients.filter(p => p.triageResult.triageColor === 'YELLOW').length;
  const greenCount = patients.filter(p => p.triageResult.triageColor === 'GREEN').length;

  // 3. Search & Sort
  const filteredPatients = patients.filter(p => {
    const query = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query) ||
      p.symptoms.toLowerCase().includes(query) ||
      p.triageResult.triageColor.toLowerCase().includes(query)
    );
  });

  // Sort logic
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // 4. Pagination
  const itemsPerPage = 5;
  const totalEntries = sortedPatients.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = sortedPatients.slice(startIndex, startIndex + itemsPerPage);

  const displayFrom = totalEntries === 0 ? 0 : startIndex + 1;
  const displayTo = Math.min(currentPage * itemsPerPage, totalEntries);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 5. Sync Offline pending cases
  const handleSyncCases = () => {
    const isOffline = localStorage.getItem('triage_offline_mode') === 'true';

    if (isOffline) {
      setSyncError(t("Cannot sync — Offline Mode is ON. Go to Settings to disable it.", {
        hi: "सिंक नहीं हो सकता — ऑफ़लाइन मोड चालू है। सेटिंग्स में जाकर बंद करें।",
        te: "సింక్ చేయడం సాధ్యం కాదు — ఆఫ్‌లైన్ మోడ్ ON ఉంది. సెట్టింగ్స్‌లో ఆపివేయండి."
      }));
      setTimeout(() => setSyncError(''), 4000);
      return;
    }

    if (pendingSync === 0) {
      setSyncMessage(t("✓ All patient logs are already synced with the central health portal.", {
        hi: "✓ सभी मरीजों का डेटा पहले से ही सेंट्रल हेल्थ पोर्टल से सिंक हो चुका है।",
        te: "✓ అన్ని రోగుల డేటా ఇప్పటికే సెంట్రల్ హెల్త్ పోర్టల్‌తో సింక్ చేయబడింది."
      }));
      setTimeout(() => setSyncMessage(''), 3500);
      return;
    }

    setSyncing(true);
    setSyncMessage(t("Connecting to National Health Database...", {
      hi: "राष्ट्रीय स्वास्थ्य डेटाबेस से जोड़ा जा रहा है...",
      te: "జాతీయ ఆరోగ్య డేటాబేస్‌కు కనెక్ట్ అవుతోంది..."
    }));

    setTimeout(() => {
      setSyncMessage(t("Syncing patient vitals, diagnostics, and AI assessments...", {
        hi: "मरीजों के वाइटल्स, डायग्नोस्टिक्स और AI रिपोर्ट सिंक हो रहे हैं...",
        te: "రోగుల వైటల్స్, డయాగ్నస్టిక్స్ మరియు AI అంచనాలు సింక్ అవుతున్నాయి..."
      }));
      setTimeout(() => {
        const updatedPatients = patients.map(p => {
          if (p.syncStatus === 'pending') {
            return { ...p, syncStatus: 'synced' };
          }
          return p;
        });

        localStorage.setItem('asha_patients', JSON.stringify(updatedPatients));
        setPatients(updatedPatients);
        setSyncing(false);
        setSyncMessage(t("✓ Offline patient logs synced successfully with the central portal!", {
          hi: "✓ ऑफ़लाइन मरीजों का डेटा सफलतापूर्वक सिंक हो गया!",
          te: "✓ ఆఫ్‌లైన్ రోగుల డేటా విజయవంతంగా సింక్ చేయబడింది!"
        }));
        setTimeout(() => setSyncMessage(''), 4000);
      }, 1200);
    }, 800);
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

      <main className="app-dashboard-main">
        {/* Page Header */}
        <div className="dashboard-page-header">
          <div>
            <h1 className="dashboard-title">
              {t('ASHA Patient Log', { hi: 'आशा रोगी लॉग', te: 'ఆశా రోగి లాగ్' })}
            </h1>
            <p className="dashboard-subtitle">
              {t('Triage village patients, administer local first aid, and sync clinical records.', {
                hi: 'गाँव के मरीजों की जांच करें, प्राथमिक उपचार दें और डेटा सिंक करें।',
                te: 'గ్రామ రోగులను పరీక్షించి, ప్రాథమిక చికిత్స అందించండి మరియు డేటాను సింక్ చేయండి.'
              })}
            </p>
          </div>
          
          <div className="header-action-buttons">
            <button 
              onClick={handleSyncCases}
              disabled={syncing}
              className="btn-secondary"
              title={pendingSync === 0 ? t('All logs already synced', {hi: 'सभी डेटा सिंक हो चुका है', te: 'అన్ని డేటా సింక్ చేయబడ్డాయి'}) : t('Click to sync offline patient logs', {hi: 'ऑफ़लाइन डेटा सिंक करने के लिए क्लिक करें', te: 'ఆఫ్‌లైన్ డేటాను సింక్ చేయడానికి క్లిక్ చేయండి'})}
            >
              <RefreshCw size={16} className={syncing ? "loading-spinner" : ""} />
              {syncing 
                ? t('Syncing...', { hi: 'सिंक हो रहा है...', te: 'సింక్ అవుతోంది...' }) 
                : pendingSync > 0 
                  ? `${t('Sync Offline Logs', { hi: 'ऑफ़लाइन डेटा सिंक करें', te: 'ఆఫ్‌లైన్ డేటాను సింక్ చేయండి' })} (${pendingSync})`
                  : t('All Synced ✓', { hi: 'सभी सिंक ✓', te: 'అన్నీ సింక్ ✓' })
              }
            </button>
            <button 
              onClick={() => navigate('/triage')} 
              className="btn-primary"
            >
              <Plus size={18} />
              {t('Start New Triage', { hi: 'नया मरीज देखें', te: 'కొత్త రోగిని చూడండి' })}
            </button>
          </div>
        </div>

        {/* Sync error alert */}
        {syncError && (
          <div className="login-alert-error">
            <AlertTriangle size={18} />
            <span>{syncError}</span>
          </div>
        )}

        {/* Syncing indicator modal overlay */}
        {syncing && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(30, 41, 59, 0.65)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            backdropFilter: 'blur(4px)'
          }}>
            <div className="login-card-container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <RefreshCw size={48} className="loading-spinner" style={{ color: 'var(--primary-solid)' }} />
              <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: '700' }}>{t('Syncing Patients Log', { hi: 'मरीजों का डेटा सिंक हो रहा है', te: 'రోగుల డేటా సింక్ అవుతోంది' })}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{syncMessage}</p>
            </div>
          </div>
        )}

        {/* Sync success/info toast — shown after sync or when already synced */}
        {!syncing && syncMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
            border: '1px solid #6ee7b7',
            borderRadius: 'var(--border-radius-md)',
            padding: '0.75rem 1.2rem',
            marginBottom: '1rem',
            color: '#065f46',
            fontWeight: '500',
            fontSize: '0.9rem',
            boxShadow: '0 2px 8px rgba(16,185,129,0.15)'
          }}>
            <span style={{ fontSize: '1.1rem' }}>✅</span>
            <span>{syncMessage}</span>
          </div>
        )}


        <section className="overview-metrics-grid">
          <div className="metric-card total">
            <div className="metric-card-info">
              <span className="metric-card-label">{t('Total Patients', { hi: 'कुल मरीज', te: 'మొత్తం రోగులు' })}</span>
              <span className="metric-card-value">{totalTriaged}</span>
            </div>
            <div className="metric-card-icon-container">
              <Users size={22} />
            </div>
          </div>

          <div className="metric-card red-orange">
            <div className="metric-card-info">
              <span className="metric-card-label">{t('Emergency (Red/Orange)', { hi: 'आपातकाल (लाल/नारंगी)', te: 'అత్యవసర (ఎరుపు/నారింజ)' })}</span>
              <span className="metric-card-value">{emergencyCases}</span>
            </div>
            <div className="metric-card-icon-container">
              <AlertTriangle size={22} />
            </div>
          </div>

          <div className="metric-card yellow-green">
            <div className="metric-card-info">
              <span className="metric-card-label">{t('Stable (Yellow/Green)', { hi: 'स्थिर (पीला/हरा)', te: 'స్థిరమైన (పసుపు/ఆకుపచ్చ)' })}</span>
              <span className="metric-card-value">{stableCases}</span>
            </div>
            <div className="metric-card-icon-container">
              <CheckCircle size={22} />
            </div>
          </div>

          <div className="metric-card offline">
            <div className="metric-card-info">
              <span className="metric-card-label">{t('Pending Sync (Offline)', { hi: 'सिंक होना बाकी', te: 'సింక్ పెండింగ్‌లో ఉంది' })}</span>
              <span className="metric-card-value">{pendingSync}</span>
            </div>
            <div className="metric-card-icon-container">
              <Clock size={22} />
            </div>
          </div>
        </section>

        {/* Triage Urgency Distribution Cards */}
        <section className="service-summary-grid">
          <div className="summary-card-item red">
            <span className="summary-item-label">RED Priority</span>
            <span className="summary-item-value">{redCount} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>{t('Immediate', { hi: 'तुरंत', te: 'వెంటనే' })}</span></span>
          </div>
          <div className="summary-card-item orange">
            <span className="summary-item-label">ORANGE Priority</span>
            <span className="summary-item-value">{orangeCount} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>{t('Very Urgent', { hi: 'अति आवश्यक', te: 'అత్యవసరం' })}</span></span>
          </div>
          <div className="summary-card-item yellow">
            <span className="summary-item-label">YELLOW Priority</span>
            <span className="summary-item-value">{yellowCount} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>{t('Urgent', { hi: 'आवश्यक', te: 'అవసరం' })}</span></span>
          </div>
          <div className="summary-card-item green">
            <span className="summary-item-label">GREEN Priority</span>
            <span className="summary-item-value">{greenCount} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>{t('Stable', { hi: 'स्थिर', te: 'స్థిరమైన' })}</span></span>
          </div>
        </section>

        {/* Patient Registry Table */}
        <section className="all-referrals-table-section">
          <div className="table-section-title-bar">
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.25rem' }}>{t('Patient Registry', { hi: 'मरीज सूची', te: 'రోగుల జాబితా' })}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Showing {displayFrom}-{displayTo} of {totalEntries} cases</span>
          </div>

          <div className="referrals-table-header-controls">
            <div className="table-filters-container">
              <div className="search-filter-wrapper">
                <Search size={16} className="search-prefix-icon" />
                <input
                  type="text"
                  placeholder={t("Search patient, ID, symptoms or triage...", { hi: "मरीज खोजें...", te: "రోగి కోసం శోధించండి..." })}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="search-text-filter"
                />
              </div>

              <div className="sort-filter-wrapper">
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sort:</span>
                <div className="sort-select-container">
                  <select
                    value={sortOrder}
                    onChange={(e) => {
                      setSortOrder(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="sort-dropdown-select"
                  >
                    <option value="desc">{t('Date (Newest)', { hi: 'दिनांक (नया)', te: 'తేదీ (కొత్తది)' })}</option>
                    <option value="asc">{t('Date (Oldest)', { hi: 'दिनांक (पुराना)', te: 'తేదీ (పాతది)' })}</option>
                  </select>
                  <ArrowUpDown size={14} className="sort-arrow-icon" />
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive-container">
            <table>
              <thead>
                <tr>
                  <th>{t('Patient ID', { hi: 'मरीज ID', te: 'రోగి ID' })}</th>
                  <th>{t('Patient Name', { hi: 'मरीज का नाम', te: 'రోగి పేరు' })}</th>
                  <th>{t('Age/Gender', { hi: 'उम्र/लिंग', te: 'వయస్సు/లింగం' })}</th>
                  <th>{t('Date Logged', { hi: 'जांच की तारीख', te: 'తేదీ' })}</th>
                  <th>{t('Triage Status', { hi: 'स्थिति', te: 'స్థితి' })}</th>
                  <th>{t('Sync Status', { hi: 'सिंक स्थिति', te: 'సింక్ స్థితి' })}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPatients.length > 0 ? (
                  paginatedPatients.map(patient => (
                    <tr 
                      key={patient.id} 
                      onClick={() => navigate(`/patient/${patient.id}`)}
                      className="referrals-interactive-row"
                    >
                      <td style={{ fontWeight: '600', color: 'var(--primary-solid)' }}>
                        {patient.id}
                      </td>
                      <td style={{ fontWeight: '500' }}>
                        {patient.name}
                      </td>
                      <td>
                        {patient.age} yrs / {patient.gender}
                      </td>
                      <td>
                        {patient.date.split('-').join('/')}
                      </td>
                      <td>
                        <span className={`severity-badge ${getSeverityBadgeClass(patient.triageResult.triageColor)}`}>
                          {patient.triageResult.triageColor}
                        </span>
                      </td>
                      <td>
                        <span className={`sync-badge ${patient.syncStatus === 'synced' ? 'synced' : 'pending'}`}>
                          {patient.syncStatus === 'synced' ? <Check size={12} /> : <Clock size={12} />}
                          {patient.syncStatus === 'synced' ? t('Synced', { hi: 'सिंक हो गया', te: 'సింక్ చేయబడింది' }) : t('Pending', { hi: 'बाकी', te: 'పెండింగ్‌లో ఉంది' })}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="table-empty-body-row">
                    <td colSpan="6">
                      <div className="empty-state-view">
                        <Users size={36} className="empty-state-icon" />
                        <span className="empty-state-title">{t('No patient logs found', { hi: 'कोई मरीज नहीं मिला', te: 'ఏ రోగులు కనుగొనబడలేదు' })}</span>
                        <p style={{ fontSize: '0.85rem' }}>{t('Try refining your search or add a new patient triage record.', { hi: 'खोज बदलें या नया मरीज जोड़ें।', te: 'శోధనను మార్చండి లేదా కొత్త రోగిని జోడించండి.' })}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="table-pagination-nav">
              <span className="pagination-feedback-text">
                Page <span>{currentPage}</span> of <span>{totalPages}</span>
              </span>
              
              <div className="pagination-btn-group">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  {t('Prev', { hi: 'पिछला', te: 'మునుపటి' })}
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  {t('Next', { hi: 'अगला', te: 'తదుపరి' })}
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
