import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID  = 'service_zg3fp2d';
const EMAILJS_TEMPLATE_ID = 'template_of7uoy3';
const EMAILJS_PUBLIC_KEY  = 'hU5ijL1FeDKPMdnp_';

const FIELDS = [
  { id: 'nome',       label: 'Nome completo',    type: 'text',   placeholder: 'Mario Rossi' },
  { id: 'email',      label: 'Email aziendale',  type: 'email',  placeholder: 'mario@azienda.it' },
  { id: 'azienda',    label: 'Azienda',          type: 'text',   placeholder: 'Nome impresa' },
  { id: 'dipendenti', label: 'N° dipendenti',    type: 'select', options: ['1-10', '11-50', '51-200', '200+'] },
  { id: 'telefono',   label: 'Telefono',         type: 'tel',    placeholder: '+39 02 1234567', optional: true },
];

const ease = [0.16, 1, 0.3, 1];

export default function DemoFormOverlay({ isOpen, onClose }) {
  const [form, setForm]           = useState({});
  const [focused, setFocused]     = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);
  const [error, setError]         = useState(null);

  useEffect(() => {
    if (!isOpen) { setTimeout(() => { setSubmitted(false); setForm({}); }, 400); }
    document.body.style.overflow = isOpen ? 'hidden' : '';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email:   'unvexdgroup@gmail.com',
          from_name:  form.nome       || '',
          from_email: form.email      || '',
          azienda:    form.azienda    || '',
          dipendenti: form.dipendenti || '',
          telefono:   form.telefono   || 'non fornito',
        },
        EMAILJS_PUBLIC_KEY
      );
      setSubmitted(true);
    } catch {
      setError('Invio fallito. Riprova o scrivici direttamente.');
    } finally {
      setSending(false);
    }
  };

  const borderColor = (id) =>
    focused === id
      ? 'oklch(0.82 0.14 200)'
      : 'oklch(0.28 0.015 240)';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease }}
          className="fixed inset-0 z-[200] flex"
          style={{ background: 'oklch(0.055 0.012 240)' }}
        >
          {/* Grain texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '180px 180px',
            }}
          />

          {/* Right-side glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 55% 60% at 75% 50%, oklch(0.22 0.07 230 / 0.18) 0%, transparent 70%)',
            }}
          />

          {/* Close */}
          <motion.button
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="absolute top-7 right-7 z-10 p-2 text-white/25 hover:text-white/70 transition-colors duration-200"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </motion.button>

          <div className="flex w-full h-full">

            {/* ── Left: brand statement (lg+) ── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ delay: 0.12, duration: 0.65, ease }}
              className="hidden lg:flex flex-col justify-between w-[44%] px-16 py-14 border-r"
              style={{ borderColor: 'oklch(0.22 0.01 240)' }}
            >
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-cyan-glow/40" />
                <span className="text-[11px] tracking-[0.22em] uppercase text-cyan-glow/60">
                  SyncHR
                </span>
              </div>

              <div>
                <h2
                  className="text-[5.5rem] xl:text-[6.5rem] font-bold text-white/90"
                  style={{ lineHeight: 0.9 }}
                >
                  Prendi il<br />
                  controllo<br />
                  della tua<br />
                  <em style={{ fontStyle: 'italic', color: 'oklch(0.82 0.14 200)' }}>azienda.</em>
                </h2>
              </div>

              <div className="space-y-5">
                {['Setup in meno di 48 ore', 'Onboarding guidato', 'Nessun costo nascosto'].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.08, duration: 0.5, ease }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className="w-1 h-1 rounded-full shrink-0"
                      style={{ background: 'oklch(0.82 0.14 200 / 0.5)' }}
                    />
                    <span className="text-sm text-white/40">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── Right: form ── */}
            <div className="flex-1 flex items-center justify-center px-8 md:px-14 lg:px-20 py-16 overflow-y-auto">
              <AnimatePresence mode="wait">

                {!submitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ delay: 0.2, duration: 0.55, ease }}
                    className="w-full max-w-[420px]"
                  >
                    {/* Header */}
                    <div className="mb-11">
                      <p
                        className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-3"
                        style={{ fontFamily: 'DM Sans' }}
                      >
                        Richiedi demo
                      </p>
                      <h3
                        className="text-4xl font-bold text-white/90"
                        style={{ fontFamily: 'Noto Serif Display', fontStretch: 'extra-condensed', lineHeight: 1 }}
                      >
                        Parliamoci.
                      </h3>
                    </div>

                    {/* Fields */}
                    <div className="space-y-8">
                      {FIELDS.map((field, i) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.28 + i * 0.07, duration: 0.45, ease }}
                        >
                          <label
                            htmlFor={field.id}
                            className="block text-[10px] tracking-[0.18em] uppercase mb-2.5"
                            style={{ fontFamily: 'DM Sans', color: 'oklch(0.55 0.015 240)' }}
                          >
                            {field.label}
                            {field.optional && (
                              <span className="ml-2 normal-case tracking-normal" style={{ color: 'oklch(0.4 0.01 240)' }}>
                                facoltativo
                              </span>
                            )}
                          </label>

                          {field.type === 'select' ? (
                            <div className="relative">
                              <select
                                id={field.id}
                                required
                                value={form[field.id] || ''}
                                onChange={e => setForm(p => ({ ...p, [field.id]: e.target.value }))}
                                onFocus={() => setFocused(field.id)}
                                onBlur={() => setFocused(null)}
                                className="w-full bg-transparent appearance-none outline-none cursor-pointer pb-3 text-[15px] transition-colors duration-300"
                                style={{
                                  fontFamily: 'DM Sans',
                                  color: form[field.id] ? 'oklch(0.88 0.01 240)' : 'oklch(0.45 0.01 240)',
                                  borderBottom: `1px solid ${borderColor(field.id)}`,
                                }}
                              >
                                <option value="" disabled style={{ background: '#070a12' }}>Seleziona</option>
                                {field.options.map(opt => (
                                  <option key={opt} value={opt} style={{ background: '#070a12' }}>{opt}</option>
                                ))}
                              </select>
                              <div className="absolute right-0 bottom-3.5 pointer-events-none" style={{ color: 'oklch(0.4 0.01 240)' }}>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                            </div>
                          ) : (
                            <input
                              id={field.id}
                              type={field.type}
                              required={!field.optional}
                              placeholder={field.placeholder}
                              value={form[field.id] || ''}
                              onChange={e => setForm(p => ({ ...p, [field.id]: e.target.value }))}
                              onFocus={() => setFocused(field.id)}
                              onBlur={() => setFocused(null)}
                              className="w-full bg-transparent outline-none pb-3 text-[15px] transition-colors duration-300"
                              style={{
                                fontFamily: 'DM Sans',
                                color: 'oklch(0.88 0.01 240)',
                                borderBottom: `1px solid ${borderColor(field.id)}`,
                              }}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={sending}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.68, duration: 0.45, ease }}
                      whileHover={{ scale: sending ? 1 : 1.015 }}
                      whileTap={{ scale: sending ? 1 : 0.985 }}
                      className="mt-11 w-full flex items-center justify-between px-7 py-4 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: 'oklch(0.96 0.006 240)',
                        color: 'oklch(0.12 0.02 240)',
                        fontFamily: 'DM Sans',
                      }}
                    >
                      <span>{sending ? 'Invio in corso...' : 'Invia richiesta'}</span>
                      {sending
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <ArrowRight className="w-4 h-4" />
                      }
                    </motion.button>

                    {error && (
                      <p className="mt-4 text-center text-[12px] text-red-400" style={{ fontFamily: 'DM Sans' }}>
                        {error}
                      </p>
                    )}

                    <p
                      className="mt-5 text-center text-[11px] text-white/20"
                      style={{ fontFamily: 'DM Sans' }}
                    >
                      Ti ricontattiamo entro 24 ore.
                    </p>
                  </motion.form>

                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.55, ease }}
                    className="text-center max-w-xs"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1, duration: 0.6, ease }}
                      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-8"
                      style={{ background: 'oklch(0.16 0.04 200)' }}
                    >
                      <CheckCircle className="w-6 h-6" style={{ color: 'oklch(0.82 0.14 200)' }} />
                    </motion.div>

                    <h3
                      className="text-4xl font-bold text-white/90 mb-4"
                      style={{ fontFamily: 'Noto Serif Display', fontStretch: 'extra-condensed', lineHeight: 0.95 }}
                    >
                      Richiesta<br />inviata.
                    </h3>

                    <p className="text-white/35 text-sm leading-relaxed mb-10" style={{ fontFamily: 'DM Sans' }}>
                      Il team SyncHR ti contatterà a breve per organizzare la demo personalizzata.
                    </p>

                    <button
                      onClick={onClose}
                      className="text-[11px] tracking-[0.18em] uppercase text-white/25 hover:text-white/55 transition-colors duration-200"
                      style={{ fontFamily: 'DM Sans' }}
                    >
                      Chiudi
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
