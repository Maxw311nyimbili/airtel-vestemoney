import React from 'react';

export default function DeviceMockup({ children, darkModeStatus, timeString }) {
  return (
    <div className="device-container scale-up">
      {/* Mobile Top Camera Notch */}
      <div className="device-island"></div>
      
      {/* Mobile Screen */}
      <div className="device-screen">
        
        {/* Mobile Header / Status bar */}
        <div className={`device-status-bar ${darkModeStatus ? 'dark-mode-status' : ''}`}>
          <div className="status-left">
            <span>{timeString}</span>
          </div>
          <div className="status-right">
            <span style={{ fontSize: '11px', fontWeight: '800' }}>Airtel ZM</span>
            <div className="status-network-bar">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span style={{ fontSize: '10px' }}>5G</span>
            <div className="status-battery">
              <div className="status-battery-level"></div>
            </div>
          </div>
        </div>

        {/* View Content Slot */}
        <div className="view-wrapper">
          {children}
        </div>
        
        {/* Mobile Home Bar Indicator */}
        <div className={`device-home-indicator ${darkModeStatus ? 'light-indicator' : ''}`}></div>
      </div>
    </div>
  );
}
