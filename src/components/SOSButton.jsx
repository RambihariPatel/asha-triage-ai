import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, X, Siren, Shield, Heart, PhoneCall, AlertTriangle, Baby } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SOSButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const emergencyNumbers = [
    { number: '108', labelEn: 'Ambulance', labelHi: 'एम्बुलेंस', labelTe: 'అంబులెన్స్', icon: Siren, color: '#ef4444' },
    { number: '112', labelEn: 'Emergency Police', labelHi: 'आपातकालीन पुलिस', labelTe: 'అత్యవసర పోలీసు', icon: Shield, color: '#3b82f6' },
    { number: '1098', labelEn: 'Child Helpline', labelHi: 'बाल हेल्पलाइन', labelTe: 'చైల్డ్ హెల్ప్‌లైన్', icon: Baby, color: '#f59e0b' },
    { number: '181', labelEn: 'Women Helpline', labelHi: 'महिला हेल्पलाइन', labelTe: 'మహిళా హెల్ప్‌లైన్', icon: Heart, color: '#ec4899' },
    { number: '104', labelEn: 'Health Helpline', labelHi: 'स्वास्थ्य हेल्पलाइन', labelTe: 'ఆరోగ్య హెల్ప్‌లైన్', icon: PhoneCall, color: '#10b981' },
  ];

  return (
    <>
      {/* Inject keyframe animations */}
      <style>{`
        @keyframes sosPulseRing {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        @keyframes sosPulseButton {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @keyframes sosModalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes sosOverlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sosShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* Floating SOS Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Emergency SOS - Open helpline numbers"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 9999,
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.3)',
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
          color: '#ffffff',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          boxShadow: '0 4px 20px rgba(220, 38, 38, 0.5), 0 0 40px rgba(220, 38, 38, 0.25)',
          animation: 'sosPulseButton 2s ease-in-out infinite',
          transition: 'box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 30px rgba(220, 38, 38, 0.7), 0 0 60px rgba(220, 38, 38, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(220, 38, 38, 0.5), 0 0 40px rgba(220, 38, 38, 0.25)';
        }}
      >
        {/* Pulsing red ring */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            border: '3px solid rgba(220, 38, 38, 0.6)',
            animation: 'sosPulseRing 2s ease-out infinite',
            pointerEvents: 'none',
          }}
        />
        {/* Second offset ring for richer effect */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            border: '2px solid rgba(239, 68, 68, 0.4)',
            animation: 'sosPulseRing 2s ease-out 0.6s infinite',
            pointerEvents: 'none',
          }}
        />
        <Phone size={18} strokeWidth={2.5} />
        <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '1.5px', lineHeight: 1 }}>
          SOS
        </span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Emergency Helpline Numbers"
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            animation: 'sosOverlayFadeIn 0.25s ease-out',
          }}
        >
          {/* Modal Card */}
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'linear-gradient(165deg, rgba(255,255,255,0.97) 0%, rgba(248,250,252,0.98) 100%)',
              borderRadius: '20px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
              animation: 'sosModalFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
            }}
          >
            {/* Red header bar */}
            <div
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                borderRadius: '20px 20px 0 0',
                padding: '24px 24px 20px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Shimmer decoration */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'sosShimmer 3s linear infinite',
                }}
              />

              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close emergency modal"
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
              >
                <X size={18} strokeWidth={2.5} />
              </button>

              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff', position: 'relative' }}>
                🆘 {t('Emergency Helpline Numbers', {hi: 'आपातकालीन नंबर', te: 'అత్యవసర నంబర్‌లు'})}
              </h2>
              <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500, position: 'relative' }}>
                {t('Quick Dial Directory', {hi: 'त्वरित डायल निर्देशिका', te: 'శీఘ్ర డయల్ డైరెక్టరీ'})}
              </p>
            </div>

            {/* Emergency Numbers List */}
            <div style={{ padding: '16px 20px 8px' }}>
              {emergencyNumbers.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.number}
                    href={`tel:${item.number}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 16px',
                      marginBottom: '10px',
                      borderRadius: '14px',
                      border: `1.5px solid ${item.color}20`,
                      background: `${item.color}08`,
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${item.color}15`;
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${item.color}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `${item.color}08`;
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Icon circle */}
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: `${item.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconComponent size={22} color={item.color} strokeWidth={2} />
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                        {language === 'hi' ? item.labelHi : language === 'te' ? item.labelTe : item.labelEn}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1px' }}>
                        {language === 'en' ? item.labelHi : item.labelEn}
                      </div>
                    </div>

                    {/* Number badge */}
                    <div
                      style={{
                        background: item.color,
                        color: '#ffffff',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontWeight: 800,
                        fontSize: '1rem',
                        letterSpacing: '0.5px',
                        flexShrink: 0,
                        boxShadow: `0 2px 8px ${item.color}40`,
                      }}
                    >
                      {item.number}
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)', margin: '4px 24px 16px' }} />

            {/* Quick Protocol Section */}
            <div style={{ padding: '0 20px 22px' }}>
              <h3
                style={{
                  margin: '0 0 12px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <AlertTriangle size={14} />
                {t('Quick Protocol', { hi: 'त्वरित प्रोटोकॉल', te: 'శీఘ్ర ప్రోటోకాల్' })}
              </h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  to="/emergency-protocols"
                  onClick={() => setIsOpen(false)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '13px 12px',
                    borderRadius: '12px',
                    border: '1.5px solid #dc262630',
                    background: 'linear-gradient(135deg, #fef2f2, #fff5f5)',
                    color: '#dc2626',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(220,38,38,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fef2f2, #fff5f5)';
                    e.currentTarget.style.color = '#dc2626';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Siren size={16} />
                  {t('Emergency Protocols', {hi: 'आपातकालीन प्रोटोकॉल', te: 'అత్యవసర ప్రోటోకాల్స్'})}
                </Link>

                <Link
                  to="/triage"
                  onClick={() => setIsOpen(false)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '13px 12px',
                    borderRadius: '12px',
                    border: '1.5px solid #0d9e6830',
                    background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)',
                    color: '#059669',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #059669, #047857)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(5,150,105,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ecfdf5, #f0fdf4)';
                    e.currentTarget.style.color = '#059669';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <PhoneCall size={16} />
                  {t('Start New Triage', {hi: 'नया मरीज देखें', te: 'కొత్త రోగిని చూడండి'})}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
