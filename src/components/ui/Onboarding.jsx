import React, { useState } from 'react'
import { Zap, ChevronRight, Check, Plus, X } from 'lucide-react'
import { useAppStore } from '../../store'
import { userService } from '../../services/api'
import { LANGUAGES, BUSINESS_TYPES } from '../../services/mockData'
import { cn } from '../../utils/helpers'
import toast from 'react-hot-toast'

const STEPS = ['Welcome', 'Profile', 'Business', 'Inventory']

export default function Onboarding() {
  const { setUser } = useAppStore()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    language: '',
    businessType: '',
    rawMaterials: [{ name: '', stock: '', unit: 'kg' }],
  })

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }))
  const updateMaterial = (i, key, val) => {
    const materials = [...form.rawMaterials]
    materials[i] = { ...materials[i], [key]: val }
    setForm((f) => ({ ...f, rawMaterials: materials }))
  }
  const addMaterial = () =>
    setForm((f) => ({ ...f, rawMaterials: [...f.rawMaterials, { name: '', stock: '', unit: 'kg' }] }))
  const removeMaterial = (i) =>
    setForm((f) => ({ ...f, rawMaterials: f.rawMaterials.filter((_, idx) => idx !== i) }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // await userService.onboard(form)
      // Mock for demo:
      setUser({ ...form, id: 1, createdAt: new Date().toISOString() })
      toast.success('Welcome to VoiceTrace!')
    } catch {
      // Demo fallback
      setUser({ ...form, id: 1, createdAt: new Date().toISOString() })
    } finally {
      setLoading(false)
    }
  }

  const canNext = () => {
    if (step === 1) return form.name.trim() && form.language
    if (step === 2) return form.businessType
    return true
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4"
         style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(20,184,166,0.06) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(251,191,36,0.06) 0%, transparent 50%)' }}>
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-200">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-slate-900 text-2xl tracking-tight">VoiceTrace</span>
        </div>

        <div className="card overflow-hidden">
          {/* Step Progress */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center gap-2 mb-6">
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div className={cn(
                    'flex items-center gap-1.5',
                  )}>
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                      i < step ? 'bg-teal-600 text-white' :
                      i === step ? 'bg-teal-600 text-white ring-4 ring-teal-100' :
                      'bg-slate-100 text-slate-400'
                    )}>
                      {i < step ? <Check className="w-3 h-3" /> : i + 1}
                    </div>
                    <span className={cn('text-xs font-medium hidden sm:block', i === step ? 'text-teal-700' : 'text-slate-400')}>
                      {s}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={cn('flex-1 h-px', i < step ? 'bg-teal-300' : 'bg-slate-200')} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step Content */}
            <div className="animate-fade-in min-h-[240px]">
              {step === 0 && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-teal-600" strokeWidth={1.5} />
                  </div>
                  <h2 className="font-display font-bold text-slate-900 text-2xl mb-2">
                    Welcome to VoiceTrace
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                    Your voice-powered business companion. Record sales and expenses by just speaking — we handle the rest.
                  </p>
                  <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                    {[['🎙️', 'Voice Input'], ['📊', 'Auto Reports'], ['📈', 'AI Insights']].map(([emoji, label]) => (
                      <div key={label} className="bg-slate-50 rounded-xl p-3">
                        <div className="text-2xl mb-1">{emoji}</div>
                        <div className="text-xs font-medium text-slate-600">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="font-display font-bold text-slate-900 text-xl mb-1">Your Profile</h2>
                    <p className="text-slate-500 text-sm">Tell us a bit about yourself</p>
                  </div>
                  <div>
                    <label className="label">Your Name *</label>
                    <input
                      className="input-field"
                      placeholder="e.g. Ravi Kumar"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Preferred Language *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {LANGUAGES.slice(0, 9).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => update('language', lang)}
                          className={cn(
                            'px-3 py-2 rounded-lg text-sm font-medium transition-all border',
                            form.language === lang
                              ? 'bg-teal-600 text-white border-teal-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'
                          )}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="font-display font-bold text-slate-900 text-xl mb-1">Your Business</h2>
                    <p className="text-slate-500 text-sm">What do you sell?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {BUSINESS_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => update('businessType', type)}
                        className={cn(
                          'px-3 py-2.5 rounded-xl text-sm font-medium transition-all border text-left',
                          form.businessType === type
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="font-display font-bold text-slate-900 text-xl mb-1">Raw Materials</h2>
                    <p className="text-slate-500 text-sm">Add your current stock (optional but helpful)</p>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {form.rawMaterials.map((m, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          className="input-field flex-1"
                          placeholder="Material name"
                          value={m.name}
                          onChange={(e) => updateMaterial(i, 'name', e.target.value)}
                        />
                        <input
                          className="input-field w-20"
                          placeholder="Qty"
                          type="number"
                          value={m.stock}
                          onChange={(e) => updateMaterial(i, 'stock', e.target.value)}
                        />
                        <select
                          className="input-field w-20 text-sm"
                          value={m.unit}
                          onChange={(e) => updateMaterial(i, 'unit', e.target.value)}
                        >
                          {['kg', 'g', 'L', 'ml', 'pcs'].map((u) => <option key={u}>{u}</option>)}
                        </select>
                        <button onClick={() => removeMaterial(i)} className="btn-ghost p-2">
                          <X className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={addMaterial} className="btn-secondary text-sm flex items-center gap-1.5 w-full justify-center">
                    <Plus className="w-3.5 h-3.5" /> Add Material
                  </button>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Back
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canNext()}
                  className="btn-primary flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? 'Setting up...' : "Let's Go!"} <Zap className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Your data stays private and secure. Works offline too.
        </p>
      </div>
    </div>
  )
}
