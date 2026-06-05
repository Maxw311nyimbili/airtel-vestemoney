import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import vesteLogo from '../../../images/Veste.money logo.png';
import { Icons } from '../../Icons';
import './LoginScreen.css';

export default function LoginScreen({ phoneNumber, setPhoneNumber, showToast, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(30);
  const timerRef = useRef(null);

  const isPhoneValid = phoneNumber.length === 9;
  const isOtpValid = otpCode.length === 4;

  useEffect(() => {
    if (step === 2) {
      setCountdown(30);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  const handlePhoneSubmit = (event) => {
    event.preventDefault();
    if (!isPhoneValid) {
      showToast('Please enter a valid 9-digit Airtel number.');
      return;
    }
    showToast('OTP sent to +260 ' + phoneNumber);
    setStep(2);
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    if (!isOtpValid) {
      showToast('Enter the 4-digit OTP to continue.');
      return;
    }
    setIsLoggedIn(true);
    showToast('Logged in successfully!');
    navigate('/dashboard');
  };

  const handleBypass = () => {
    setIsLoggedIn(true);
    showToast('Demo login bypassed');
    navigate('/dashboard');
  };

  return (
    <div className="banking-login-page">
      <div className="banking-login-container">
        <div className="banking-login-header">
          <button type="button" className="login-back-btn" onClick={() => step === 2 ? setStep(1) : navigate('/')}>
            <Icons.ChevronLeft />
          </button>
        </div>
        {step === 1 ? (
          <form className="banking-login-form" onSubmit={handlePhoneSubmit}>
            <h1 className="banking-login-title">Enter phone number</h1>
            
            <div className="banking-input-group">
              <input
                type="text"
                className="banking-input-field"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 97XXXXXXX"
                maxLength={9}
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              className="banking-signup-btn"
              disabled={!isPhoneValid}
            >
              Sign up
            </button>
          </form>
        ) : (
          <form className="banking-login-form" onSubmit={handleOtpSubmit}>
            <h1 className="banking-login-title">Enter Verification code</h1>
            
            <div className="banking-input-group">
              <input
                type="text"
                className="banking-input-field"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="4-digit code"
                maxLength={4}
                autoFocus
              />
            </div>

            <div className="otp-timer-row" style={{ display: 'flex', justifyContent: 'center', marginTop: '-8px' }}>
              {countdown > 0 ? (
                <span className="otp-timer-text" style={{ fontSize: '12px', color: '#9ba1b2' }}>Resend code in {countdown}s</span>
              ) : (
                <button type="button" style={{ background: 'none', border: 'none', color: '#E30613', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }} onClick={() => { setCountdown(30); showToast('New code sent.'); }}>
                  Resend OTP
                </button>
              )}
            </div>
            
            <button
              type="submit"
              className="banking-signup-btn"
              disabled={!isOtpValid}
            >
              Sign up
            </button>
            
            <button type="button" className="banking-back-link" onClick={() => setStep(1)}>
              Change phone number
            </button>
          </form>
        )}

        {/* Demo Bypass Option for testing */}
        <div className="banking-bypass-container">
          <button type="button" className="banking-bypass-btn" onClick={handleBypass}>
            Bypass Authentication (Demo Only)
          </button>
          <div className="banking-powered-by">
            <span>Powered by</span>
            <img src={vesteLogo} alt="Veste logo" className="banking-powered-logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
