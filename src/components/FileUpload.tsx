'use client';

import { TradeRecord } from '@/lib/types';
import { useState } from 'react';

interface FileUploadProps {
  onDataLoaded: (data: TradeRecord[]) => void;
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [textInput, setTextInput] = useState<string>('');

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    const text = await file.text();
    processData(text);
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) {
      setErrorMessage('Please enter JSON data');
      setUploadStatus('error');
      return;
    }
    processData(textInput);
  };

  const processData = (text: string) => {
    setUploadStatus('processing');
    setErrorMessage('');

    try {
      const data = JSON.parse(text);
      
      if (!Array.isArray(data)) {
        throw new Error('JSON must contain an array of trade records');
      }

      const validatedData: TradeRecord[] = data.map((record: unknown) => {
        const tradeRecord = record as Record<string, unknown>;
        if (!tradeRecord.date || !tradeRecord.amount_usd) {
          throw new Error('Invalid record format. Required: date, amount_usd');
        }
        
        // Map action to valid type or default to 'buy'
        let action: TradeRecord['action'] = 'buy';
        if (typeof tradeRecord.action === 'string') {
          const validActions: TradeRecord['action'][] = ['buy', 'sell', 'dividend', 'deposit', 'tax_june', 'tax_july', 'tax_august'];
          if (validActions.includes(tradeRecord.action as TradeRecord['action'])) {
            action = tradeRecord.action as TradeRecord['action'];
          }
        }
        
        return {
          date: tradeRecord.date as string,
          symbol: (tradeRecord.symbol as string) || null,
          action,
          shares: (tradeRecord.shares as number) || null,
          amount_usd: tradeRecord.amount_usd as number
        };
      });

      onDataLoaded(validatedData);
      setUploadStatus('success');
      if (inputMode === 'text') {
        setTextInput(''); // Clear text input on success
      }
    } catch (error) {
      console.error('Error processing data:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      setUploadStatus('error');
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'processing': return 'var(--tv-accent-blue)';
      case 'success': return 'var(--tv-positive)';
      case 'error': return 'var(--tv-negative)';
      default: return 'var(--tv-text-primary)';
    }
  };

  const aiPrompt = `The input is screenshots from Blink, a stock trading application. Each image contains a list of user actions.

Task:
Extract all trade actions from the images and return the results in a structured JSON array with the following schema:

[
  {
    "date": "YYYY-MM-DD",
    "symbol": "TICKER",
    "pnl": NUMBER,
    "quantity": NUMBER,
    "price": NUMBER,
    "side": "buy | sell",
    "commission": NUMBER
  }
]

Instructions:
1. Parse the images and identify all trade actions.
2. For each trade, extract:
   - Trade date (date)
   - Stock ticker symbol (symbol)
   - Profit or loss (pnl)
   - Quantity (quantity)
   - Trade price (price)
   - Trade side (side: either "buy" or "sell")
   - Commission (commission)
3. If the same trade action appears in multiple images, include it only once in the output.
4. Ensure the JSON is valid, complete, and follows the specified schema.`;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(aiPrompt);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <div>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '500', 
              color: 'var(--v0-text-primary)',
              marginBottom: '8px'
            }}>
              Import Your Trading Data
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: 'var(--v0-text-secondary)',
              margin: '0'
            }}>
              Upload JSON files or paste data directly to get started
            </p>
          </div>
          
          {/* Mode Toggle */}
          <div style={{ 
            display: 'flex', 
            gap: '4px', 
            backgroundColor: 'var(--v0-surface-light)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid var(--v0-border)'
          }}>
            <button
              onClick={() => setInputMode('file')}
              className={inputMode === 'file' ? 'tv-button' : 'tv-button-secondary'}
              style={{
                fontSize: '14px',
                padding: '8px 16px',
                backgroundColor: inputMode === 'file' ? 'var(--v0-accent)' : 'transparent',
                color: inputMode === 'file' ? 'white' : 'var(--v0-text-primary)',
                border: 'none',
                boxShadow: inputMode === 'file' ? '0 2px 4px rgba(16, 185, 129, 0.2)' : 'none'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              Upload File
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={inputMode === 'text' ? 'tv-button' : 'tv-button-secondary'}
              style={{
                fontSize: '14px',
                padding: '8px 16px',
                backgroundColor: inputMode === 'text' ? 'var(--v0-accent)' : 'transparent',
                color: inputMode === 'text' ? 'white' : 'var(--v0-text-primary)',
                border: 'none',
                boxShadow: inputMode === 'text' ? '0 2px 4px rgba(16, 185, 129, 0.2)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              Paste JSON
            </button>
          </div>
          
          {inputMode === 'file' ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px', 
              alignItems: 'center',
              padding: '32px',
              border: '2px dashed var(--v0-border)',
              borderRadius: '16px',
              backgroundColor: 'var(--v0-surface)',
              transition: 'all 0.25s ease-in-out'
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px',
                backgroundColor: 'var(--v0-surface-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"/>
                  <path d="M7 16l4-4 4 4 6-6"/>
                </svg>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <p style={{ 
                  fontSize: '15px', 
                  color: 'var(--v0-text-primary)', 
                  margin: '0 0 4px 0',
                  fontWeight: '500'
                }}>
                  Select a JSON file with your trading data
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  color: 'var(--v0-text-secondary)', 
                  margin: 0
                }}>
                  Supports .json files up to 10MB
                </p>
              </div>
              
              <input
                type="file"
                accept=".json"
                onChange={handleFileInput}
                style={{ display: 'none' }}
                id="file-input"
              />
              <label htmlFor="file-input" className="tv-button" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
                Choose File
              </label>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <p style={{ 
                  fontSize: '15px', 
                  color: 'var(--v0-text-primary)', 
                  margin: '0 0 4px 0',
                  fontWeight: '500'
                }}>
                  Paste your JSON trading data
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  color: 'var(--v0-text-secondary)', 
                  margin: 0
                }}>
                  Copy and paste your formatted trading data below
                </p>
              </div>
              
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={`[\n  {\n    "date": "2024-01-15",\n    "symbol": "AAPL",\n    "action": "buy",\n    "shares": 100,\n    "amount_usd": 15000\n  }\n]`}
                className="tv-input"
                style={{
                  minHeight: '140px',
                  fontSize: '13px',
                  fontFamily: 'SF Mono, Monaco, Cascadia Code, Roboto Mono, Consolas, Courier New, monospace',
                  resize: 'vertical',
                  lineHeight: '1.5'
                }}
              />
              
              <button
                onClick={handleTextSubmit}
                className="tv-button"
                disabled={!textInput.trim()}
                style={{
                  opacity: !textInput.trim() ? '0.5' : '1',
                  cursor: !textInput.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6"/>
                  <path d="M21 12h-6m-6 0H3"/>
                </svg>
                Process Data
              </button>
            </div>
          )}

          {uploadStatus !== 'idle' && (
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: uploadStatus === 'success' ? 'rgba(16, 185, 129, 0.1)' :
                              uploadStatus === 'error' ? 'rgba(239, 68, 68, 0.1)' :
                              'var(--v0-surface-light)',
              border: `1px solid ${
                uploadStatus === 'success' ? 'var(--v0-green)' :
                uploadStatus === 'error' ? 'var(--v0-red)' :
                'var(--v0-border)'
              }`,
              color: uploadStatus === 'success' ? 'var(--v0-green)' :
                     uploadStatus === 'error' ? 'var(--v0-red)' :
                     'var(--v0-text-primary)',
              fontWeight: '500', 
              fontSize: '14px'
            }}>
              <span>
                {uploadStatus === 'processing' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                )}
                {uploadStatus === 'success' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                )}
                {uploadStatus === 'error' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                )}
              </span>
              <span>
                {uploadStatus === 'processing' && 'Processing your trading data...'}
                {uploadStatus === 'success' && 'Data loaded successfully!'}
                {uploadStatus === 'error' && `Error: ${errorMessage}`}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="tv-panel">
        <div className="tv-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
              <circle cx="12" cy="16" r="1"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            AI Screenshot Processing
          </span>
          <button 
            onClick={handleCopyPrompt}
            className="tv-button-secondary"
            style={{ 
              fontSize: '13px', 
              padding: '6px 12px',
              backgroundColor: copyStatus === 'copied' ? 'var(--v0-green)' : 'var(--v0-surface-light)',
              border: `1px solid ${copyStatus === 'copied' ? 'var(--v0-green)' : 'var(--v0-border)'}`,
              color: copyStatus === 'copied' ? 'white' : 'var(--v0-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.25s ease-in-out'
            }}
          >
            <span style={{
              display: 'inline-block',
              width: '14px',
              height: '14px',
              position: 'relative'
            }}>
              {copyStatus === 'copied' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                </svg>
              )}
            </span>
            {copyStatus === 'copied' ? 'Copied!' : 'Copy Prompt'}
          </button>
        </div>
        <div className="tv-panel-content">
          <p style={{ 
            fontSize: '14px', 
            color: 'var(--v0-text-primary)', 
            marginBottom: '16px',
            lineHeight: '1.5'
          }}>
            Use this specialized prompt with ChatGPT or Claude to extract trading data from Blink app screenshots:
          </p>
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--v0-text-secondary)',
            backgroundColor: 'var(--v0-surface-light)',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'left',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            border: '1px solid var(--v0-border)',
            fontFamily: 'SF Mono, Monaco, Cascadia Code, Roboto Mono, Consolas, Courier New, monospace',
            lineHeight: '1.4'
          }}>
{aiPrompt}
          </div>
          <p style={{ 
            fontSize: '12px', 
            color: 'var(--v0-text-muted)', 
            margin: '12px 0 0 0',
            lineHeight: '1.4',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            <strong>Pro tip:</strong> Upload multiple screenshots at once for batch processing. The AI will automatically deduplicate trades and format the JSON for you.
          </p>
        </div>
      </div>
    </div>
  );
}
