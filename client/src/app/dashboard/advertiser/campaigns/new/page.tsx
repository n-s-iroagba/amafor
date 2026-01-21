
'use client';
import React, { useState } from 'react';
import { Megaphone, Layout, Upload, Target, Calculator, CreditCard, Check, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePost } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

export default function CreateCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [targetViews, setTargetViews] = useState(10000);
  const { post, isPending } = usePost(API_ROUTES.ADVERTISER.CAMPAIGNS.CREATE);
  const ratePerView = 4.20;

  const steps = [
    { id: 1, label: 'Select Zone', icon: <Layout className="w-4 h-4" /> },
    { id: 2, label: 'Upload Creative', icon: <Upload className="w-4 h-4" /> },
    { id: 3, label: 'Targeting', icon: <Target className="w-4 h-4" /> },
    { id: 4, label: 'Budget & Pay', icon: <CreditCard className="w-4 h-4" /> },
  ];

  const zones = [
    { id: 'hp_banner', name: 'Homepage Banner', size: '1200x300', price: '₦5.00', desc: 'Prime visibility on entry.' },
    { id: 'mid_article', name: 'Mid-Article Video', size: '640x360', price: '₦4.50', desc: 'Engage during reading.' },
    { id: 'sidebar', name: 'Sidebar Square', size: '300x250', price: '₦3.50', desc: 'Consistent lateral presence.' },
  ];

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleFinalize = async () => {
    try {
      await post({
        zoneId: selectedZone,
        targetViews,
        ratePerView,
      });
      router.push('/dashboard/advertiser');
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/advertiser" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Cancel Campaign
        </Link>

        <header className="mb-12 text-center">
          <h1 className="text-4xl text-[#2F4F4F] mb-4 uppercase tracking-tighter">NEW AD CAMPAIGN</h1>
          <div className="flex items-center justify-center space-x-4">
            {steps.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className={`flex items-center space-x-2 ${step >= s.id ? 'text-[#2F4F4F]' : 'text-gray-300'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${step === s.id ? 'bg-[#87CEEB] border-[#87CEEB] text-[#2F4F4F]' : step > s.id ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200'
                    }`}>
                    {step > s.id ? <Check className="w-4 h-4" /> : s.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-12 h-0.5 ${step > s.id ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </header>

        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-gray-100">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl text-[#2F4F4F] mb-8 font-black uppercase tracking-tight">1. CHOOSE AD PLACEMENT</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {zones.map(z => (
                  <button
                    key={z.id}
                    onClick={() => setSelectedZone(z.id)}
                    className={`p-8 rounded-[2rem] border-2 text-left transition-all ${selectedZone === z.id ? 'border-[#87CEEB] bg-[#87CEEB]/5 shadow-inner' : 'border-gray-100 hover:border-[#87CEEB]/30'
                      }`}
                  >
                    <div className="text-[10px] font-black text-[#87CEEB] mb-2 uppercase tracking-widest">{z.price} / VIEW</div>
                    <h3 className="text-lg font-bold mb-1 text-[#2F4F4F]">{z.name}</h3>
                    <div className="text-[10px] text-gray-400 font-bold mb-4">{z.size}px</div>
                    <p className="text-xs text-gray-500 leading-relaxed">{z.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <h2 className="text-2xl text-[#2F4F4F] mb-8 font-black uppercase tracking-tight">2. UPLOAD CREATIVE</h2>
              <div className="border-4 border-dashed border-gray-100 rounded-[3rem] p-20 hover:border-[#87CEEB]/50 transition-all cursor-pointer group bg-gray-50">
                <Upload className="w-16 h-16 text-gray-200 group-hover:text-[#87CEEB] mx-auto mb-6 transition-colors" />
                <p className="text-[#2F4F4F] font-bold mb-2">Drag & Drop your creative here</p>
                <p className="text-gray-400 text-xs">Supported: JPG, PNG, MP4 (Max 2MB)</p>
              </div>
              <div className="mt-8 bg-blue-50 p-6 rounded-2xl flex items-start text-left">
                <AlertCircle className="w-5 h-5 text-blue-500 mr-4 flex-none mt-1" />
                <p className="text-xs text-blue-600 leading-relaxed">
                  Our system will automatically validate dimensions for the selected <span className="font-bold">Homepage Banner</span> zone (1200x300px).
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl text-[#2F4F4F] mb-8 font-black uppercase tracking-tight">3. DEFINE TARGETING</h2>
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Content Category (OR logic)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Football News', 'Fixture Reports', 'Academy Updates', 'Player Spotlight', 'Club Announcements'].map(tag => (
                      <button key={tag} className="px-6 py-4 rounded-2xl border border-gray-100 text-[10px] font-black text-gray-500 hover:border-[#87CEEB] hover:text-[#2F4F4F] transition-all uppercase tracking-widest text-center">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Device Targeting</label>
                  <div className="flex space-x-4">
                    {['Desktop', 'Tablet', 'Mobile'].map(d => (
                      <label key={d} className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-[#87CEEB] focus:ring-[#87CEEB]" />
                        <span className="text-xs font-bold text-gray-500">{d}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl text-[#2F4F4F] mb-8 font-black uppercase tracking-tight">4. BUDGET & SETTLEMENT</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Target Unique Views</label>
                    <input
                      type="number"
                      value={targetViews}
                      onChange={(e) => setTargetViews(parseInt(e.target.value))}
                      className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-2xl font-black text-[#2F4F4F] focus:border-[#87CEEB] outline-none"
                    />
                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tight">Min. 1,000 views required per campaign.</p>
                  </div>
                  <div className="bg-gray-50 p-8 rounded-[2rem] border border-dashed border-gray-200">
                    <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                      <span>Per View Rate</span>
                      <span>₦{ratePerView.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-black text-[#2F4F4F] uppercase tracking-tighter">
                      <span>Total Cost</span>
                      <span>₦{(targetViews * ratePerView).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-[#2F4F4F] p-10 rounded-[2.5rem] text-white">
                    <h4 className="text-xs font-black text-[#87CEEB] uppercase tracking-widest mb-6">Payment Method</h4>
                    <div className="space-y-4">
                      {/* Online Payment */}
                      <button className="w-full p-6 rounded-2xl border-2 border-transparent bg-[#87CEEB]/10 hover:border-[#87CEEB] flex items-center justify-between transition-all group">
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 mr-4 text-[#87CEEB]" />
                          <div className="text-left">
                            <span className="block text-sm font-bold">Paystack (Card/Transfer)</span>
                            <span className="text-[10px] text-gray-400 group-hover:text-gray-300">Instant Activation</span>
                          </div>
                        </div>
                      </button>

                      {/* BRD Requirement: DEV-07 Offline Payment */}
                      <button className="w-full p-6 rounded-2xl border-2 border-transparent bg-white/5 hover:border-[#87CEEB] flex items-center justify-between transition-all group">
                        <div className="flex items-center">
                          <Upload className="w-5 h-5 mr-4 text-gray-400 group-hover:text-[#87CEEB]" />
                          <div className="text-left">
                            <span className="block text-sm font-bold">Offline / Bank Transfer</span>
                            <span className="text-[10px] text-gray-400">Upload Receipt • Manual Verification</span>
                          </div>
                        </div>
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-8 leading-relaxed">
                      <strong>Note:</strong> Offline payments require manual verification by Commercial Manager and Finance Officer (Dual Approval).
                      Activation typically takes 24-48 business hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-16 flex items-center justify-between pt-10 border-t border-gray-100">
            <button
              onClick={prevStep}
              className={`text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#2F4F4F] flex items-center ${step === 1 ? 'invisible' : ''}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Previous Step
            </button>
            {step < 4 ? (
              <button
                onClick={nextStep}
                disabled={step === 1 && !selectedZone}
                className="sky-button flex items-center space-x-3 disabled:opacity-50"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinalize}
                disabled={isPending}
                className="sky-button bg-green-500 hover:bg-green-600 text-white flex items-center space-x-3 px-10 disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isPending ? 'PROCESSING...' : 'FINALIZE & PAY'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
