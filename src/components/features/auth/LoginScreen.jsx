import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import airtelLogo from '../../../images/airtel_logo.png';
import vesteLogo from '../../../images/optimized/veste_logo.png';
import './LoginScreen.css';

export default function LoginScreen({ phoneNumber, setPhoneNumber, showToast, setIsLoggedIn, setIsGuest }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = phone, 2 = otp
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const timerRef = useRef(null);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];
  const phoneInputRef = useRef();

  const isPhoneValid = phoneNumber.replace(/\s/g, '').length === 9;
  const isOtpComplete = otp.every(d => d !== '');

  // Focus phone input on mount
  useEffect(() => {
    if (step === 1 && phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
  }, [step]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (step === 2) {
      setCountdown(30);
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) { clearInterval(timerRef.current); return 0; }
          return prev - 1;
        });
      }, 1000);
      // Focus first OTP box
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  const handlePhoneSubmit = (e) => {
    e?.preventDefault();
    if (!isPhoneValid) {
      showToast('Please enter a valid 9-digit Airtel number.');
      return;
    }
    showToast('OTP sent to +260 ' + phoneNumber);
    setStep(2);
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance to next box
    if (digit && index < 3) {
      otpRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 4 filled
    if (newOtp.every(d => d !== '')) {
      setTimeout(() => handleOtpVerify(newOtp.join('')), 120);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
    // Allow paste
    if (e.key === 'Enter' && isOtpComplete) {
      handleOtpVerify(otp.join(''));
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length === 4) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      otpRefs[3].current?.focus();
      setTimeout(() => handleOtpVerify(pasted), 120);
    }
  };

  const handleOtpVerify = (code) => {
    // In demo any 4-digit code works
    if (setIsGuest) setIsGuest(false);
    setIsLoggedIn(true);
    showToast('Verified! Welcome to Airtel Invest.');
    navigate('/dashboard');
  };

  const handleResend = () => {
    setOtp(['', '', '', '']);
    setCountdown(30);
    otpRefs[0].current?.focus();
    showToast('New OTP sent to +260 ' + phoneNumber);
    // Restart timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="otp-page">
      {/* Red header area */}
      <div className="otp-header">
        <button
          type="button"
          className="otp-back-btn"
          onClick={() => step === 2 ? setStep(1) : navigate('/')}
          aria-label="Go back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="otp-header-brand">
          <img src={airtelLogo} alt="Airtel" className="otp-airtel-logo" />
          <span className="otp-tagline">Buy and sell LuSE shares</span>
        </div>

        <div className="otp-header-text">
          {step === 1 ? (
            <>
              <h1 className="otp-header-title">Enter your number</h1>
              <p className="otp-header-sub">We'll send a one-time code to verify your Airtel number</p>
            </>
          ) : (
            <>
              <h1 className="otp-header-title">Verify your number</h1>
              <p className="otp-header-sub">Enter the 4-digit code sent to <strong>+260 {phoneNumber}</strong></p>
            </>
          )}
        </div>
      </div>

      {/* White body */}
      <div className="otp-body">
        {step === 1 ? (
          /* ── Step 1: Phone Number ── */
          <form className="otp-form" onSubmit={handlePhoneSubmit}>
            <div className="otp-phone-field">
              <div className="otp-phone-prefix">
                <span className="otp-prefix-code">+260</span>
              </div>
              <input
                ref={phoneInputRef}
                type="tel"
                className="otp-phone-input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="97 XXX XXXX"
                maxLength={9}
                inputMode="numeric"
                autoComplete="tel-national"
              />
            </div>

            <p className="otp-hint">
              Enter your 9-digit Airtel Zambia mobile number
            </p>

            <button
              type="submit"
              className="otp-primary-btn"
              disabled={!isPhoneValid}
            >
              Send Code
            </button>
          </form>
        ) : (
          /* ── Step 2: OTP Boxes ── */
          <div className="otp-form">
            <div className="otp-boxes-row" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={otpRefs[i]}
                  type="text"
                  inputMode="numeric"
                  className={`otp-box ${digit ? 'otp-box-filled' : ''}`}
                  value={digit}
                  maxLength={1}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            <div className="otp-timer-row">
              {countdown > 0 ? (
                <span className="otp-timer-text">
                  Resend code in{' '}
                  <span className="otp-timer-count">{String(countdown).padStart(2, '0')}s</span>
                </span>
              ) : (
                <button type="button" className="otp-resend-btn" onClick={handleResend}>
                  Didn't receive it? Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              className="otp-primary-btn"
              onClick={() => handleOtpVerify(otp.join(''))}
              disabled={!isOtpComplete}
            >
              Verify &amp; Continue
            </button>

            <button type="button" className="otp-change-phone" onClick={() => setStep(1)}>
              Change phone number
            </button>
          </div>
        )}

        <div className="otp-footer">
          <div className="otp-powered">
            <span>Powered by</span>
            <img src={vesteLogo} alt="Veste Money" className="otp-veste-logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
