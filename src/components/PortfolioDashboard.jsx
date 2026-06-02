import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from './Icons';
import { MOCK_TRANSACTIONS } from '../data/mockData';

export default function PortfolioDashboard({ 
  sharesOwned, 
  portfolioTotal, 
  portfolioEquities, 
  portfolioBonds, 
  portfolioSavings, 
  showToast 
}) {
  const navigate = useNavigate();

  return (
    <div className="screen-container slide-in-right">
      <div className="page-container">
        <div className="sub-page-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <Icons.ChevronLeft />
          </button>
          <div>
            <h1>My Airtel Portfolio</h1>
            <p className="page-description">A unified view of your investments, performance and recent activity.</p>
          </div>
          <button className="header-action-text" onClick={() => showToast('Statement emailed to you')}>Export</button>
        </div>

        <div className="portfolio-hero">
          <span className="portfolio-hero-label">Total Integrated Net Worth</span>
          <h2 className="portfolio-hero-value">ZMW {portfolioTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
          <p className="portfolio-hero-sub">Airtel Integrated Wealth Account • Active</p>
        </div>

        <div className="analytics-row">
          <div className="analytics-card">
            <div className="label">Capital Invested</div>
            <div className="value">ZMW {(portfolioTotal * 0.88).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
            <div className="change positive">All-Time</div>
          </div>
          <div className="analytics-card">
            <div className="label">Net Gain</div>
            <div className="value" style={{ color: 'var(--primary-red)' }}>+ZMW {(portfolioTotal * 0.12).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
            <div className="change positive">▲ 14.85%</div>
          </div>
        </div>

        <div className="asset-row">
          <div className="asset-left">
            <div className="asset-bullet" style={{ background: 'var(--primary-red)' }} />
            <div>
              <div className="asset-label">Lusaka Equities (LuSE)</div>
              <div className="asset-sub">{sharesOwned.ATEL || 0} ATEL • {sharesOwned.CEC} CEC • {sharesOwned.ZCCM} ZCCM</div>
            </div>
          </div>
          <div className="asset-right">
            <div className="asset-value">ZMW {portfolioEquities.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
            <div className="asset-yield">▲ 14.2%</div>
          </div>
        </div>
          <div className="asset-row">
            <div className="asset-left">
              <div className="asset-bullet" style={{ background: 'rgba(227, 6, 19, 0.4)' }} />
              <div>
                <div className="asset-label">GRZ Gov Securities</div>
                <div className="asset-sub">Treasury bonds &amp; bills</div>
              </div>
            </div>
            <div className="asset-right">
              <div className="asset-value">ZMW {portfolioBonds.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
              <div className="asset-yield">▲ 23.5%</div>
            </div>
          </div>
          <div className="asset-row">
            <div className="asset-left">
              <div className="asset-bullet" style={{ background: 'var(--primary-red-light)', border: '1px solid var(--primary-red)' }} />
              <div>
                <div className="asset-label">Airtel Invest Cash</div>
                <div className="asset-sub">Flexible high-yield savings</div>
              </div>
            </div>
            <div className="asset-right">
              <div className="asset-value">ZMW {portfolioSavings.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
              <div className="asset-yield">▲ 8.5%</div>
            </div>
          </div>

        <h3 className="subsection-title">Recent Portfolio History</h3>
        <div className="tx-list">
          {MOCK_TRANSACTIONS.map(tx => (
            <div key={tx.id} className={`tx-row ${tx.type}-type`}>
              <div>
                <div className="tx-title">{tx.title}</div>
                <div className="tx-date">{tx.date}</div>
              </div>
              <div className={`tx-amount ${tx.plus ? 'credit' : 'debit'}`}>
                {tx.plus ? '+' : '-'} ZMW {tx.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
