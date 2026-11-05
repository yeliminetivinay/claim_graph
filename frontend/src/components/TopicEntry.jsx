import React, { useState } from 'react';
import { Search, Loader2, Sparkles, Database, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TopicEntry({ onSubmitTopic, statusData, isSubmitting }) {
  const [topicInput, setTopicInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topicInput.trim()) {
      onSubmitTopic(topicInput.trim());
    }
  };

  const isPendingOrIngesting = statusData && (statusData.status === 'pending' || statusData.status === 'ingesting');
  const paperCount = statusData?.paper_count || 0;
  const papersProcessed = statusData?.papers_processed ?? paperCount;
  const papersTotal = statusData?.papers_total || 10;
  const isAnalyzing = statusData?.status === 'ingesting' && papersProcessed >= papersTotal;
  const progressLabel = statusData?.status === 'pending'
    ? 'Waiting for ingestion worker...'
    : isAnalyzing
      ? 'Analyzing papers & detecting contradictions...'
      : statusData?.status === 'ingesting'
        ? 'Ingesting Literature & PDFs...'
        : statusData?.status;

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1rem' }}>
      <div className="glass-card" style={{ padding: '3rem 2.5rem', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2))', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <Sparkles size={32} color="var(--accent-cyan)" />
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Enter a Research Topic
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem', maxWidth: '580px', margin: '0 auto 2rem' }}>
          ClaimGraph will find relevant scientific literature, parse available PDFs, and prepare evidence for claim verification.
        </p>

        {!statusData ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.8rem', maxWidth: '650px', margin: '0 auto' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. intermittent fasting insulin sensitivity"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                disabled={isSubmitting}
                style={{ paddingLeft: '2.8rem' }}
              />
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <button type="submit" className="btn-primary" disabled={isSubmitting || !topicInput.trim()}>
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              Ingest Topic
            </button>
          </form>
        ) : (
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left', background: 'rgba(15, 23, 42, 0.6)', padding: '1.8rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {isPendingOrIngesting ? (
                  <Loader2 size={20} color="var(--accent-cyan)" className="animate-spin" />
                ) : statusData.status === 'ready' ? (
                  <CheckCircle2 size={20} color="var(--color-support)" />
                ) : (
                  <AlertCircle size={20} color="var(--color-refute)" />
                )}
                <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                  {progressLabel}
                </span>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {papersProcessed} / {papersTotal} Papers Processed
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '5px', overflow: 'hidden', marginBottom: '1.2rem', position: 'relative' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.max(10, Math.min(100, (papersProcessed / papersTotal) * 100))}%`,
                  background: 'linear-gradient(90deg, var(--accent-indigo), var(--accent-cyan))',
                  borderRadius: '5px',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Database size={14} color="var(--accent-indigo)" /> SPECTER2 Embeddings
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={14} color="var(--accent-cyan)" /> PDF Full-Text Parser
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
