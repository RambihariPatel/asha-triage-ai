import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  Calendar,
  AlertTriangle,
  Heart,
  Shield,
  PieChart,
  ArrowLeft
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const Analytics = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [patients, setPatients] = useState([]);
  const [animated, setAnimated] = useState(false);

  // Load patients from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('asha_patients');
    if (stored) {
      try {
        setPatients(JSON.parse(stored));
      } catch {
        setPatients([]);
      }
    }
  }, []);

  // Trigger bar animation after mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // ── Computed Metrics ──────────────────────────────
  const totalPatients = patients.length;

  const redCount = patients.filter(p => p.triageResult?.triageColor === 'RED').length;
  const orangeCount = patients.filter(p => p.triageResult?.triageColor === 'ORANGE').length;
  const yellowCount = patients.filter(p => p.triageResult?.triageColor === 'YELLOW').length;
  const greenCount = patients.filter(p => p.triageResult?.triageColor === 'GREEN').length;

  const emergencyCases = redCount + orangeCount;
  const stableCases = yellowCount + greenCount;
  const emergencyPct = totalPatients > 0 ? ((emergencyCases / totalPatients) * 100).toFixed(1) : '0.0';
  const stablePct = totalPatients > 0 ? ((stableCases / totalPatients) * 100).toFixed(1) : '0.0';

  const avgAge = totalPatients > 0
    ? (patients.reduce((sum, p) => sum + (Number(p.age) || 0), 0) / totalPatients).toFixed(1)
    : '0';

  // Gender counts
  const maleCount = patients.filter(p => p.gender?.toLowerCase() === 'male').length;
  const femaleCount = patients.filter(p => p.gender?.toLowerCase() === 'female').length;
  const otherGenderCount = totalPatients - maleCount - femaleCount;

  // Age group distribution
  const ageGroups = [
    { label: '0–5', tag: t('Infant/Toddler', {hi: 'शिशु', te: 'పసిపిల్లలు'}), min: 0, max: 5 },
    { label: '6–17', tag: t('Child/Teen', {hi: 'बच्चा/किशोर', te: 'పిల్లవాడు/టీనేజర్'}), min: 6, max: 17 },
    { label: '18–45', tag: t('Adult', {hi: 'वयस्क', te: 'వయోజన'}), min: 18, max: 45 },
    { label: '46–65', tag: t('Senior', {hi: 'वरिष्ठ', te: 'సీనియర్'}), min: 46, max: 65 },
    { label: '65+', tag: t('Elderly', {hi: 'बुजुर्ग', te: 'వృద్ధుడు'}), min: 66, max: 999 }
  ];

  const ageGroupCounts = ageGroups.map(g => ({
    ...g,
    count: patients.filter(p => {
      const age = Number(p.age) || 0;
      return age >= g.min && age <= g.max;
    }).length
  }));

  const maxAgeGroupCount = Math.max(...ageGroupCounts.map(g => g.count), 1);

  // Triage distribution
  const triageLevels = [
    { label: 'RED', sublabel: t('Immediate', {hi: 'तत्काल', te: 'తక్షణం'}), count: redCount, color: '#ef4444', bg: 'var(--triage-red-bg)', border: 'var(--triage-red-border)', text: 'var(--triage-red-text)' },
    { label: 'ORANGE', sublabel: t('Very Urgent', {hi: 'अत्यंत जरूरी', te: 'చాలా అత్యవసరం'}), count: orangeCount, color: '#f97316', bg: 'var(--triage-orange-bg)', border: 'var(--triage-orange-border)', text: 'var(--triage-orange-text)' },
    { label: 'YELLOW', sublabel: t('Urgent', {hi: 'जरूरी', te: 'అత్యవసరం'}), count: yellowCount, color: '#eab308', bg: 'var(--triage-yellow-bg)', border: 'var(--triage-yellow-border)', text: 'var(--triage-yellow-text)' },
    { label: 'GREEN', sublabel: t('Stable', {hi: 'स्थिर', te: 'స్థిరమైన'}), count: greenCount, color: '#10b981', bg: 'var(--triage-green-bg)', border: 'var(--triage-green-border)', text: 'var(--triage-green-text)' }
  ];
  const maxTriageCount = Math.max(...triageLevels.map(t => t.count), 1);

  // Recent activity (last 5)
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Most common triage level
  const triageCounts = { RED: redCount, ORANGE: orangeCount, YELLOW: yellowCount, GREEN: greenCount };
  const mostCommonTriage = Object.entries(triageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Risk insight text
  const getInsightText = () => {
    const emergencyRate = parseFloat(emergencyPct);
    if (totalPatients === 0) return t('No patient data available yet. Start triaging patients to see insights.', {hi: 'अभी तक कोई रोगी डेटा उपलब्ध नहीं है। अंतर्दृष्टि देखने के लिए रोगियों का मूल्यांकन शुरू करें।', te: 'ఇంకా రోగి డేటా అందుబాటులో లేదు. అంతర్దృష్టులను చూడటానికి రోగులను అంచనా వేయడం ప్రారంభించండి.'});
    if (emergencyRate >= 60) return t('🚨 Very high emergency rate detected. Immediate medical camp deployment recommended. Consider requesting additional PHC staff.', {hi: '🚨 बहुत उच्च आपातकालीन दर पाई गई है। तत्काल चिकित्सा शिविर की सिफारिश की जाती है। अतिरिक्त PHC कर्मचारियों का अनुरोध करें।', te: '🚨 చాలా ఎక్కువ అత్యవసర రేటు కనుగొనబడింది. తక్షణ వైద్య శిబిరం సిఫార్సు చేయబడింది. అదనపు PHC సిబ్బందిని అభ్యర్థించండి.'});
    if (emergencyRate >= 40) return t('⚠️ High emergency rate detected. Consider organizing an additional medical camp and alerting the nearest PHC.', {hi: '⚠️ उच्च आपातकालीन दर पाई गई है। एक अतिरिक्त चिकित्सा शिविर आयोजित करने और निकटतम PHC को सतर्क करने पर विचार करें।', te: '⚠️ అధిక అత్యవసర రేటు కనుగొనబడింది. అదనపు వైద్య శిబిరాన్ని నిర్వహించడం మరియు సమీప PHCని అప్రమత్తం చేయడం గురించి ఆలోచించండి.'});
    if (emergencyRate >= 20) return t('📋 Moderate emergency rate. Continue regular monitoring and ensure first-aid supplies are stocked.', {hi: '📋 मध्यम आपातकालीन दर। नियमित निगरानी जारी रखें और सुनिश्चित करें कि प्राथमिक चिकित्सा आपूर्ति उपलब्ध है।', te: '📋 మోస్తరు అత్యవసర రేటు. సాధారణ పర్యవేక్షణను కొనసాగించండి మరియు ప్రథమ చికిత్స సామాగ్రి నిల్వ ఉందని నిర్ధారించుకోండి.'});
    return t('✅ Low emergency rate. Community health appears stable. Maintain routine check-ups and awareness programs.', {hi: '✅ कम आपातकालीन दर। सामुदायिक स्वास्थ्य स्थिर है। नियमित जांच और जागरूकता कार्यक्रम बनाए रखें।', te: '✅ తక్కువ అత్యవసర రేటు. సమాజ ఆరోగ్యం స్థిరంగా ఉన్నట్లు కనిపిస్తోంది. సాధారణ తనిఖీలు మరియు అవగాహన కార్యక్రమాలను నిర్వహించండి.'});
  };

  // ── Triage color dot helper ───────────────────────
  const getTriageDotColor = (color) => {
    switch (color?.toUpperCase()) {
      case 'RED': return '#ef4444';
      case 'ORANGE': return '#f97316';
      case 'YELLOW': return '#eab308';
      case 'GREEN': return '#10b981';
      default: return '#94a3b8';
    }
  };

  // ── Styles ────────────────────────────────────────
  const styles = {
    contentArea: {
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '2rem 1.25rem',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      animation: 'fadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
    },
    backBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'var(--bg-surface)',
      border: '1.5px solid var(--border-color)',
      borderRadius: 'var(--border-radius-sm)',
      padding: '0.6rem 1.25rem',
      fontWeight: '600',
      fontSize: '0.925rem',
      cursor: 'pointer',
      color: 'var(--text-secondary)',
      transition: 'all 0.15s ease',
      width: 'fit-content'
    },
    pageTitle: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: '2.25rem',
      letterSpacing: '-0.04em',
      color: 'var(--text-primary)',
      lineHeight: 1.15,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    pageSubtitle: {
      color: 'var(--text-secondary)',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1rem'
    },
    statCard: {
      backgroundColor: 'var(--bg-surface)',
      border: '1.5px solid var(--border-light)',
      borderRadius: 'var(--border-radius-md)',
      padding: '1.5rem 1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-sm)',
      transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden'
    },
    statIconBox: {
      width: '54px',
      height: '54px',
      borderRadius: 'var(--border-radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    statLabel: {
      fontSize: '0.82rem',
      fontWeight: 600,
      color: 'var(--text-secondary)',
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    },
    statValue: {
      fontFamily: 'var(--font-display)',
      fontSize: '2.25rem',
      fontWeight: 900,
      color: 'var(--text-primary)',
      lineHeight: 1.05,
      letterSpacing: '-0.03em'
    },
    statSub: {
      fontSize: '0.78rem',
      fontWeight: 500,
      color: 'var(--text-muted)',
      marginTop: '2px'
    },
    card: {
      backgroundColor: 'var(--bg-surface)',
      border: '1.5px solid var(--border-light)',
      borderRadius: 'var(--border-radius-md)',
      padding: '1.75rem',
      boxShadow: 'var(--shadow-sm)'
    },
    cardTitle: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '1.2rem',
      color: 'var(--text-primary)',
      marginBottom: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    barRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '0.875rem'
    },
    barLabel: {
      width: '80px',
      fontSize: '0.82rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      textAlign: 'right',
      flexShrink: 0
    },
    barTrack: {
      flex: 1,
      height: '32px',
      backgroundColor: 'var(--bg-base)',
      borderRadius: '8px',
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid var(--border-light)'
    },
    barCount: {
      fontSize: '0.8rem',
      fontWeight: 700,
      color: 'var(--text-secondary)',
      minWidth: '55px',
      textAlign: 'left',
      flexShrink: 0
    },
    twoColGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem'
    },
    // Timeline
    timelineContainer: {
      position: 'relative',
      paddingLeft: '2rem'
    },
    timelineLine: {
      position: 'absolute',
      left: '8px',
      top: '8px',
      bottom: '8px',
      width: '2px',
      backgroundColor: 'var(--border-color)',
      borderRadius: '2px'
    },
    timelineItem: {
      position: 'relative',
      paddingBottom: '1.5rem',
      paddingLeft: '0.75rem'
    },
    timelineDot: {
      position: 'absolute',
      left: '-1.85rem',
      top: '6px',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      border: '3px solid var(--bg-surface)',
      boxShadow: '0 0 0 2px var(--border-light)',
      zIndex: 2
    },
    insightCard: {
      background: 'linear-gradient(135deg, #0f172a 0%, #0f4c4c 40%, #0e7490 100%)',
      borderRadius: 'var(--border-radius-md)',
      padding: '2rem',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(13, 148, 136, 0.3)'
    }
  };

  return (
    <div className="app-layout-page">
      <Navbar />

      <main style={styles.contentArea}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          style={styles.backBtn}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-solid)'; e.currentTarget.style.color = 'var(--primary-solid)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <ArrowLeft size={18} />
          {t('Back to Dashboard', { hi: 'डैशबोर्ड पर वापस जाएं', te: 'డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి' })}
        </button>

        {/* Page Header */}
        <div>
          <h1 style={styles.pageTitle}>
            <BarChart3 size={32} style={{ color: 'var(--primary-solid)' }} />
            {t('Patient Analytics & Insights', {hi: 'रोगी विश्लेषण', te: 'రోగి విశ్లేషణ & అంతర్దృష్టులు'})}
          </h1>
          <p style={{ ...styles.pageSubtitle, marginTop: '0.25rem' }}>
            {t('Comprehensive triage data overview for your village health unit.', {hi: 'आपके गांव की स्वास्थ्य इकाई के लिए व्यापक डेटा अवलोकन।', te: 'మీ గ్రామ ఆరోగ్య కేంద్రం కోసం సమగ్ర ట్రయాజ్ డేటా అవలోకనం.'})}
          </p>
        </div>

        {/* ═══ Section 1: Summary Stats ═══ */}
        <section style={styles.statsGrid}>
          {/* Total Patients */}
          <div style={styles.statCard}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={styles.statLabel}>{t('Total Patients Triaged', {hi: 'कुल मरीज़ देखे गए', te: 'మొత్తం రోగులు అంచనా వేయబడ్డారు'})}</span>
              <span style={styles.statValue}>{totalPatients}</span>
            </div>
            <div style={{ ...styles.statIconBox, backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--primary-accent)' }}>
              <Users size={22} />
            </div>
          </div>

          {/* Emergency Cases */}
          <div style={styles.statCard}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={styles.statLabel}>{t('Emergency Cases', {hi: 'आपातकालीन मामले', te: 'అత్యవసర కేసులు'})}</span>
              <span style={{ ...styles.statValue, color: 'var(--color-error)' }}>{emergencyCases}</span>
              <span style={styles.statSub}>{emergencyPct}% {t('of total', {hi: 'कुल का', te: 'మొత్తంలో'})}</span>
            </div>
            <div style={{ ...styles.statIconBox, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)' }}>
              <AlertTriangle size={22} />
            </div>
          </div>

          {/* Stable Cases */}
          <div style={styles.statCard}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={styles.statLabel}>{t('Stable Cases', {hi: 'स्थिर मामले', te: 'స్థిరమైన కేసులు'})}</span>
              <span style={{ ...styles.statValue, color: 'var(--color-success)' }}>{stableCases}</span>
              <span style={styles.statSub}>{stablePct}% {t('of total', {hi: 'कुल का', te: 'మొత్తంలో'})}</span>
            </div>
            <div style={{ ...styles.statIconBox, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)' }}>
              <Heart size={22} />
            </div>
          </div>

          {/* Average Age */}
          <div style={styles.statCard}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={styles.statLabel}>{t('Average Patient Age', {hi: 'मरीजों की औसत आयु', te: 'రోగి సగటు వయస్సు'})}</span>
              <span style={styles.statValue}>{avgAge}</span>
              <span style={styles.statSub}>{t('years', {hi: 'वर्ष', te: 'సంవత్సరాలు'})}</span>
            </div>
            <div style={{ ...styles.statIconBox, backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
              <Calendar size={22} />
            </div>
          </div>
        </section>

        {/* ═══ Section 2: Triage Distribution ═══ */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>
            <BarChart3 size={20} style={{ color: 'var(--primary-solid)' }} />
            {t('Triage Severity Distribution', {hi: 'ट्राइएज गंभीरता वितरण', te: 'ట్రయాజ్ తీవ్రత పంపిణీ'})}
          </h3>
          <div>
            {triageLevels.map(level => {
              const pct = totalPatients > 0 ? ((level.count / totalPatients) * 100).toFixed(1) : '0.0';
              const barWidth = animated ? `${(level.count / maxTriageCount) * 100}%` : '0%';
              return (
                <div key={level.label} style={styles.barRow}>
                  <span style={{ ...styles.barLabel, color: level.text }}>
                    {level.label}
                  </span>
                  <div style={styles.barTrack}>
                    <div style={{
                      height: '100%',
                      width: barWidth,
                      backgroundColor: level.color,
                      borderRadius: '8px',
                      transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: level.count > 0 ? '10px' : '0',
                      minWidth: level.count > 0 ? '36px' : '0'
                    }}>
                      {level.count > 0 && (
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                          {level.count}
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={styles.barCount}>
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
          {totalPatients === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', paddingTop: '0.5rem' }}>
              No patient data available to display distribution.
            </p>
          )}
        </section>

        {/* ═══ Two-Column: Gender + Age Group ═══ */}
        <div className="analytics-two-col-grid">
          {/* ═══ Section 3: Gender Distribution ═══ */}
          <section style={styles.card}>
            <h3 style={styles.cardTitle}>
              <PieChart size={20} style={{ color: 'var(--primary-solid)' }} />
              {t('Gender Distribution', {hi: 'लिंग वितरण', te: 'లింగ పంపిణీ'})}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Male */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>👨 {t('Male', {hi: 'पुरुष', te: 'మగ'})}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3b82f6' }}>
                    {maleCount} ({totalPatients > 0 ? ((maleCount / totalPatients) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
                <div style={{ ...styles.barTrack, height: '24px' }}>
                  <div style={{
                    height: '100%',
                    width: animated ? `${totalPatients > 0 ? (maleCount / totalPatients) * 100 : 0}%` : '0%',
                    backgroundColor: '#3b82f6',
                    borderRadius: '8px',
                    transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    minWidth: maleCount > 0 ? '20px' : '0'
                  }} />
                </div>
              </div>
              {/* Female */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>👩 {t('Female', {hi: 'महिला', te: 'ఆడ'})}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ec4899' }}>
                    {femaleCount} ({totalPatients > 0 ? ((femaleCount / totalPatients) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
                <div style={{ ...styles.barTrack, height: '24px' }}>
                  <div style={{
                    height: '100%',
                    width: animated ? `${totalPatients > 0 ? (femaleCount / totalPatients) * 100 : 0}%` : '0%',
                    backgroundColor: '#ec4899',
                    borderRadius: '8px',
                    transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    minWidth: femaleCount > 0 ? '20px' : '0'
                  }} />
                </div>
              </div>
              {/* Other (if any) */}
              {otherGenderCount > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>🧑 {t('Other', {hi: 'अन्य', te: 'ఇతర'})}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#8b5cf6' }}>
                      {otherGenderCount} ({totalPatients > 0 ? ((otherGenderCount / totalPatients) * 100).toFixed(0) : 0}%)
                    </span>
                  </div>
                  <div style={{ ...styles.barTrack, height: '24px' }}>
                    <div style={{
                      height: '100%',
                      width: animated ? `${totalPatients > 0 ? (otherGenderCount / totalPatients) * 100 : 0}%` : '0%',
                      backgroundColor: '#8b5cf6',
                      borderRadius: '8px',
                      transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      minWidth: otherGenderCount > 0 ? '20px' : '0'
                    }} />
                  </div>
                </div>
              )}
              {totalPatients === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No data</p>
              )}
            </div>
          </section>

          {/* ═══ Section 4: Age Group Distribution ═══ */}
          <section style={styles.card}>
            <h3 style={styles.cardTitle}>
              <TrendingUp size={20} style={{ color: 'var(--primary-solid)' }} />
              {t('Age Group Distribution', {hi: 'आयु वर्ग वितरण', te: 'వయస్సు సమూహ పంపిణీ'})}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ageGroupCounts.map((group, idx) => {
                const barColor = ['#f97316', '#eab308', '#0d9488', '#3b82f6', '#8b5cf6'][idx];
                return (
                  <div key={group.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {group.label} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.78rem' }}>({group.tag})</span>
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: barColor }}>{group.count}</span>
                    </div>
                    <div style={{ ...styles.barTrack, height: '20px' }}>
                      <div style={{
                        height: '100%',
                        width: animated ? `${(group.count / maxAgeGroupCount) * 100}%` : '0%',
                        backgroundColor: barColor,
                        borderRadius: '8px',
                        transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        transitionDelay: `${idx * 80}ms`,
                        minWidth: group.count > 0 ? '16px' : '0'
                      }} />
                    </div>
                  </div>
                );
              })}
              {totalPatients === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No data</p>
              )}
            </div>
          </section>
        </div>

        {/* ═══ Section 5: Recent Activity Timeline ═══ */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>
            <Activity size={20} style={{ color: 'var(--primary-solid)' }} />
            {t('Recent Triage Activity', {hi: 'हाल की गतिविधियां', te: 'ఇటీవలి కార్యకలాపాలు'})}
          </h3>
          {recentPatients.length > 0 ? (
            <div style={styles.timelineContainer}>
              <div style={styles.timelineLine} />
              {recentPatients.map((patient, idx) => {
                const dotColor = getTriageDotColor(patient.triageResult?.triageColor);
                const symptomPreview = patient.symptoms?.length > 90
                  ? patient.symptoms.substring(0, 90) + '…'
                  : patient.symptoms || 'No symptoms recorded';
                return (
                  <div key={patient.id || idx} style={styles.timelineItem}>
                    <div style={{ ...styles.timelineDot, backgroundColor: dotColor }} />
                    <div style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--border-radius-sm)',
                      padding: '1rem 1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                      onClick={() => navigate(`/patient/${patient.id}`)}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(13, 148, 136, 0.3)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.375rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                            {patient.name}
                          </span>
                          <span className={`severity-badge ${patient.triageResult?.triageColor?.toLowerCase() || 'green'}`}>
                            {patient.triageResult?.triageColor || 'N/A'}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={13} />
                          {patient.date || 'Unknown'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        {symptomPreview}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <Activity size={36} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
              <p style={{ fontWeight: 600 }}>No triage activity recorded yet.</p>
            </div>
          )}
        </section>

        {/* ═══ Section 6: AI Risk Insights ═══ */}
        <section style={styles.insightCard}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px',
            borderRadius: '50%', background: 'rgba(6, 182, 212, 0.12)', pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', bottom: '-50px', left: '25%', width: '250px', height: '250px',
            borderRadius: '50%', background: 'rgba(13, 148, 136, 0.08)', pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <Shield size={22} style={{ color: '#a5f3fc' }} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: '#fff', margin: 0 }}>
                  {t('AI Risk Summary', {hi: 'AI जोखिम सारांश', te: 'AI రిస్క్ సారాంశం'})}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', margin: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t('Automated Insights', {hi: 'स्वचालित अंतर्दृष्टि', te: 'ఆటోమేటెడ్ ఇన్‌సైట్స్'})}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{
                background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem 1.25rem',
                border: '1px solid rgba(255,255,255,0.12)'
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.5)' }}>
                  {t('Most Common Level', {hi: 'सबसे आम स्तर', te: 'అత్యంత సాధారణ స్థాయి'})}
                </span>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginTop: '0.25rem' }}>
                  {mostCommonTriage}
                </div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem 1.25rem',
                border: '1px solid rgba(255,255,255,0.12)'
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.5)' }}>
                  {t('Emergency Rate', {hi: 'आपातकालीन दर', te: 'అత్యవసర రేటు'})}
                </span>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: parseFloat(emergencyPct) >= 40 ? '#fca5a5' : '#86efac', marginTop: '0.25rem' }}>
                  {emergencyPct}%
                </div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem 1.25rem',
                border: '1px solid rgba(255,255,255,0.12)'
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.5)' }}>
                  {t('Total Triaged', {hi: 'कुल मूल्यांकन', te: 'మొత్తం అంచనా వేయబడింది'})}
                </span>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginTop: '0.25rem' }}>
                  {totalPatients}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1rem 1.25rem',
              border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.92rem', lineHeight: 1.6,
              color: 'rgba(255,255,255,0.85)', fontWeight: 500
            }}>
              {getInsightText()}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
