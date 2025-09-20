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
    <div className="tv-panel" style={{ textAlign: 'center' }}>
      <div className="tv-panel-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--tv-text-secondary)' }}>
            Upload Trading Data
          </div>
          
          {/* Mode Toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <button
              onClick={() => setInputMode('file')}
              className="tv-button"
              style={{
                backgroundColor: inputMode === 'file' ? 'var(--tv-accent-blue)' : 'var(--tv-background-secondary)',
                color: inputMode === 'file' ? 'white' : 'var(--tv-text-primary)',
                fontSize: '14px',
                padding: '8px 12px'
              }}
            >
              Upload File
            </button>
            <button
              onClick={() => setInputMode('text')}
              className="tv-button"
              style={{
                backgroundColor: inputMode === 'text' ? 'var(--tv-accent-blue)' : 'var(--tv-background-secondary)',
                color: inputMode === 'text' ? 'white' : 'var(--tv-text-primary)',
                fontSize: '14px',
                padding: '8px 12px'
              }}
            >
              Paste JSON
            </button>
          </div>
          
          {inputMode === 'file' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <p style={{ fontSize: '16px', color: 'var(--tv-text-primary)', margin: 0 }}>
                Select a JSON file with your trading data
              </p>
              
              <input
                type="file"
                accept=".json"
                onChange={handleFileInput}
                style={{ display: 'none' }}
                id="file-input"
              />
              <label htmlFor="file-input" className="tv-button">
                Choose File
              </label>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', width: '100%' }}>
              <p style={{ fontSize: '16px', color: 'var(--tv-text-primary)', margin: 0 }}>
                Paste your JSON trading data below
              </p>
              
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste your JSON data here..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  backgroundColor: 'var(--tv-background-secondary)',
                  color: 'var(--tv-text-primary)',
                  border: '1px solid var(--tv-border)',
                  borderRadius: '4px',
                  resize: 'vertical',
                  outline: 'none'
                }}
              />
              
              <button
                onClick={handleTextSubmit}
                className="tv-button"
                disabled={!textInput.trim()}
                style={{
                  backgroundColor: !textInput.trim() ? 'var(--tv-background-secondary)' : 'var(--tv-accent-blue)',
                  color: !textInput.trim() ? 'var(--tv-text-secondary)' : 'white',
                  cursor: !textInput.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                Submit JSON
              </button>
            </div>
          )}

          {uploadStatus !== 'idle' && (
            <div style={{ color: getStatusColor(), fontWeight: '500', fontSize: '14px' }}>
              {uploadStatus === 'processing' && 'Processing data...'}
              {uploadStatus === 'success' && 'Data loaded successfully!'}
              {uploadStatus === 'error' && `Error: ${errorMessage}`}
            </div>
          )}
        </div>
      </div>

      <div className="tv-panel" style={{ marginTop: '24px' }}>
        <div className="tv-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>AI Prompt for Blink Screenshots</span>
          <button 
            onClick={handleCopyPrompt}
            className="tv-button"
            style={{ 
              fontSize: '12px', 
              padding: '4px 8px',
              backgroundColor: copyStatus === 'copied' ? 'var(--tv-positive)' : 'var(--tv-accent-blue)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              position: 'relative'
            }}>
              {copyStatus === 'copied' ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                </svg>
              )}
            </span>
            {copyStatus === 'copied' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="tv-panel-content">
          <p style={{ fontSize: '14px', color: 'var(--tv-text-primary)', marginBottom: '16px' }}>
            Use this prompt with your AI tool to process Blink trading screenshots:
          </p>
          <pre style={{ 
            fontSize: '12px', 
            color: 'var(--tv-text-secondary)',
            backgroundColor: 'var(--tv-background-secondary)',
            padding: '16px',
            borderRadius: '4px',
            textAlign: 'left',
            overflow: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
{aiPrompt}
          </pre>
          <p style={{ fontSize: '12px', color: 'var(--tv-text-secondary)', margin: '8px 0 0 0' }}>
            Click the copy button above to copy this prompt and use it with an AI that can process images.
          </p>
        </div>
      </div>
    </div>
  );
}
