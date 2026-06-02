import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import airtelLogo from '../images/airtel_logo.png';
import vesteLogo from '../images/Veste.money logo.png';
import './LoginScreen.css';

export default function LoginScreen({ phoneNumber, setPhoneNumber, showToast, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const timerRef = useRef(null);

  const otpInputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const isPhoneValid = phoneNumber.length === 9;
  const otp = otpDigits.join('');
  const isOtpValid = otp.length === 4;

  // Handle countdown timer for Step 2
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
    // Focus the first OTP box in next tick
    setTimeout(() => {
      if (otpInputsRef[0].current) otpInputsRef[0].current.focus();
    }, 50);
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

  const handleOtpDigitChange = (value, index) => {
    const cleaned = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = cleaned.slice(-1); // Keep the last entered digit
    setOtpDigits(newDigits);

    // If entered a number, jump to next input
    if (cleaned !== '' && index < 3) {
      otpInputsRef[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (event, index) => {
    if (event.key === 'Backspace') {
      const newDigits = [...otpDigits];
      if (newDigits[index] !== '') {
        // Clear current box
        newDigits[index] = '';
        setOtpDigits(newDigits);
      } else if (index > 0) {
        // Jump to previous box and clear it
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        otpInputsRef[index - 1].current.focus();
      }
    }
  };

  const handleResendOtp = () => {
    setCountdown(30);
    setOtpDigits(['', '', '', '']);
    showToast('A new OTP has been sent.');
    if (otpInputsRef[0].current) otpInputsRef[0].current.focus();

    // Restart timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBypass = () => {
    setIsLoggedIn(true);
    showToast('Demo login bypassed');
    navigate('/dashboard');
  };

  return (
    <div className="screen-container login-screen slide-in-left">
      <div className="login-wallpaper">
        <div className="login-card">
          <div className="login-brand-row">
            <div className="airtel-logo-badge">
              <img src={airtelLogo} alt="Airtel logo" className="airtel-logo-icon" />
            </div>
            <div className="login-brand-copy">
              <p className="login-label">Airtel Money</p>
              <h1 className="login-heading">
                {step === 1 ? 'Enter your number' : 'Verify Identity'}
              </h1>
              <p className="login-description">
                {step === 1
                  ? 'Access your unified Airtel trading wallet and invest in local stocks and bonds.'
                  : `Enter the 4-digit code sent to +260 ${phoneNumber.slice(0, 3)} *** ${phoneNumber.slice(-2)}`}
              </p>
            </div>
          </div>

          <form className="login-form" onSubmit={step === 1 ? handlePhoneSubmit : handleOtpSubmit}>
            {step === 1 ? (
              <>
                <div className="input-group">
                  <label className="input-label" htmlFor="phone">Mobile Number</label>
                  <div className="phone-input-container">
                    <div className="phone-prefix">
                      <span className="phone-flag">ZM</span>
                      <span>+260</span>
                    </div>
                    <input
                      id="phone"
                      type="text"
                      className="phone-field"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="97XXXXXXX"
                      maxLength={9}
                      autoFocus
                    />
                  </div>
                </div>
                <p className="step-help">Use your Airtel mobile money registered SIM to authenticate.</p>
              </>
            ) : (
              <>
                <div className="input-group">
                  <label className="input-label">Enter 4-Digit OTP</label>
                  <div className="otp-digit-row">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpInputsRef[idx]}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={1}
                        className="otp-digit-field"
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(e.target.value, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                        placeholder="•"
                      />
                    ))}
                  </div>
                </div>

                <div className="otp-timer-row">
                  {countdown > 0 ? (
                    <span className="otp-timer-text">Resend code in {countdown}s</span>
                  ) : (
                    <button type="button" className="otp-resend-btn" onClick={handleResendOtp}>
                      Resend OTP code
                    </button>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              className="submit-btn btn-press-active"
              disabled={step === 1 ? !isPhoneValid : !isOtpValid}
            >
              {step === 1 ? 'Send OTP code' : 'Verify & Proceed'}
            </button>
          </form>

          <div className="login-actions">
            {step === 2 && (
              <button type="button" className="text-btn" onClick={() => { setStep(1); setOtpDigits(['', '', '', '']); }}>
                Change phone number
              </button>
            )}
          </div>

          <div className="login-footer">
            <button type="button" className="text-btn back-landing-link" onClick={() => navigate('/')}>
              Back to home page
            </button>
            <div className="bypass-container">
              <button type="button" className="bypass-link-btn" onClick={handleBypass}>
                Bypass Authentication (Demo Only)
              </button>
            </div>
            <div className="login-powered-by">
              <span>Powered by</span>
              <img src={vesteLogo} alt="Veste logo" className="login-powered-by-logo" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
