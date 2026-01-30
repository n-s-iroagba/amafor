
'use client';
import React, { useState } from 'react';
import { Layout, Upload, Target, CreditCard, Check, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGet, usePost } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import PaymentButton from '@/features/paystack/components/PaymentButton';
import { PaymentType } from '@/features/paystack/types';
import { AdZone } from '@/features/advertisement/types';


/**
 * Page: Create Campaign
 * Description: Multi-step form to create a new advertising campaign (Zone selection, creative upload, targeting, payment).
 * Requirements: REQ-ADV-02 (Create Campaign), REQ-ADV-04 (Targeting)
 * User Story: US-ADV-003 (Launch Campaign)
 * User Journey: UJ-ADV-002 (Campaign Creation)
 * API: POST /advertiser/campaigns (API_ROUTES.ADVERTISER.CAMPAIGNS.CREATE), GET /ads/zones (API_ROUTES.ADS.ZONES.LIST)
 * Hook: usePost(API_ROUTES.ADVERTISER.CAMPAIGNS.CREATE), useGet(API_ROUTES.ADS.ZONES.LIST)
 */
export default function CreateCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedZone, setSelectedZone] = useState<AdZone | null>(null);
  const [targetViews, setTargetViews] = useState(1000);
  const [creativeFile, setCreativeFile] = useState<File | null>(null);
  const [targeting, setTargeting] = useState<string[]>([]);

  const { post, isPending } = usePost(API_ROUTES.ADVERTISER.CAMPAIGNS.CREATE);
  const { data: zones = [] } = useGet<AdZone[]>(API_ROUTES.ADS.ZONES.LIST);

  const steps = [
    { id: 1, label: 'Select Zone', icon: <Layout className="w-4 h-4" /> },
    { id: 2, label: 'Upload Creative', icon: <Upload className="w-4 h-4" /> },
    { id: 3, label: 'Targeting', icon: <Target className="w-4 h-4" /> },
    { id: 4, label: 'Budget & Pay', icon: <CreditCard className="w-4 h-4" /> },
  ];

  const handleCreativeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCreativeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCreativeFile(e.target.files[0]);
    }
  };

  const toggleTargeting = (tag: string) => {
    setTargeting(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleCreateCampaign = async () => {
    if (!selectedZone) return;

    try {
      // 1. Create Campaign
      const campaignData = {
        name: `${selectedZone.name} Campaign - ${new Date().toLocaleDateString()}`,
        zoneId: selectedZone.id,
        targetViews,
        budget: targetViews * selectedZone.pricePerView,
        targeting,
        startDate: new Date(), // Default to now
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 days
      };

      const campaign = await post(campaignData);

      if (campaign && campaign.id) {
        // If we have a creative file, we should upload it now
        // BUT simpler workflow for now: Redirect to campaign detail where they can see it and manage creatives
        // Or we could try to upload if we had a multi-part endpoint ready.
        // Given the separate 'AdCreative' endpoint, we'll let the user know.
        router.push(`/dashboard/advertiser/campaigns/${campaign.id}`);
      }
    } catch (error) {
      console.error('Failed to create campaign', error);
      // Toast error here
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/advertiser" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Cancel Campaign
        </Link>

        {/* Header Steps */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl text-[#2F4F4F] mb-4 uppercase tracking-tighter">NEW AD CAMPAIGN</h1>
          <div className="flex items-center justify-center space-x-4">
            {steps.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className={`flex items-center space-x-2 ${step >= s.id ? 'text-[#2F4F4F]' : 'text-gray-300'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${step === s.id ? 'bg-[#87CEEB] border-[#87CEEB] text-[#2F4F4F]' : step > s.id ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200'
                    }`}
                    data-testid={`step-indicator-${s.id}`}
                  >
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
                    onClick={() => setSelectedZone(z)}
                    className={`p-8 rounded-[2rem] border-2 text-left transition-all ${selectedZone?.id === z.id ? 'border-[#87CEEB] bg-[#87CEEB]/5 shadow-inner' : 'border-gray-100 hover:border-[#87CEEB]/30'
                      }`}
                    data-testid={`zone-option-${z.id}`}
                  >
                    <div className="text-[10px] font-black text-[#87CEEB] mb-2 uppercase tracking-widest">{z.pricePerView} / VIEW</div>
                    <h3 className="text-lg font-bold mb-1 text-[#2F4F4F]">{z.name}</h3>
                    <div className="text-[10px] text-gray-400 font-bold mb-4">{z.dimensions}</div>
                    <p className="text-xs text-gray-500 leading-relaxed">{z.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <h2 className="text-2xl text-[#2F4F4F] mb-8 font-black uppercase tracking-tight">2. UPLOAD CREATIVE</h2>
              <div
                className={`border-4 border-dashed rounded-[3rem] p-20 transition-all cursor-pointer group bg-gray-50 relative ${creativeFile ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-[#87CEEB]/50'}`}
                onDrop={handleCreativeDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('file-upload')?.click()}
                data-testid="dropzone-creative"
              >
                <input id="file-upload" type="file" className="hidden" onChange={handleFileSelect} accept="image/*,video/*" data-testid="input-upload-creative" />
                {creativeFile ? (
                  <div>
                    <Check className="w-16 h-16 text-green-500 mx-auto mb-6" />
                    <p className="text-[#2F4F4F] font-bold mb-2">{creativeFile.name}</p>
                    <p className="text-gray-400 text-xs">{(creativeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-16 h-16 text-gray-200 group-hover:text-[#87CEEB] mx-auto mb-6 transition-colors" />
                    <p className="text-[#2F4F4F] font-bold mb-2">Drag & Drop your creative here</p>
                    <p className="text-gray-400 text-xs">Supported: JPG, PNG, MP4 (Max 2MB)</p>
                  </>
                )}
              </div>
              <div className="mt-8 bg-blue-50 p-6 rounded-2xl flex items-start text-left">
                <AlertCircle className="w-5 h-5 text-blue-500 mr-4 flex-none mt-1" />
                <p className="text-xs text-blue-600 leading-relaxed">
                  Creative upload is optional here. You can manage your creatives later in the campaign dashboard.
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
                      <button
                        key={tag}
                        onClick={() => toggleTargeting(tag)}
                        className={`px-6 py-4 rounded-2xl border text-[10px] font-black transition-all uppercase tracking-widest text-center ${targeting.includes(tag) ? 'bg-[#2F4F4F] text-white border-[#2F4F4F]' : 'border-gray-100 text-gray-500 hover:border-[#87CEEB] hover:text-[#2F4F4F]'
                          }`}
                        data-testid={`tag-option-${tag}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && selectedZone && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl text-[#2F4F4F] mb-8 font-black uppercase tracking-tight">4. BUDGET & SETTLEMENT</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Target Unique Views</label>
                    <input
                      type="number"
                      value={targetViews}
                      onChange={(e) => setTargetViews(parseInt(e.target.value) || 0)}
                      className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-2xl font-black text-[#2F4F4F] focus:border-[#87CEEB] outline-none"
                      data-testid="input-target-views"
                    />
                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tight">Min. 1,000 views required per campaign.</p>
                  </div>
                  <div className="bg-gray-50 p-8 rounded-[2rem] border border-dashed border-gray-200">
                    <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                      <span>Per View Rate</span>
                      <span>₦{selectedZone.pricePerView.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-black text-[#2F4F4F] uppercase tracking-tighter">
                      <span>Total Cost</span>
                      <span>₦{(targetViews * selectedZone.pricePerView).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-[#2F4F4F] p-10 rounded-[2.5rem] text-white">
                    <h4 className="text-xs font-black text-[#87CEEB] uppercase tracking-widest mb-6">Create Campaign</h4>
                    <p className="text-gray-400 text-xs mb-4">Create your campaign now. Payment can be made after creation.</p>

                    <button
                      onClick={handleCreateCampaign}
                      disabled={isPending || targetViews < 1000}
                      className="w-full p-6 rounded-xl bg-[#87CEEB] text-[#2F4F4F] font-black uppercase tracking-widest hover:bg-[#87CEEB]/90 disabled:opacity-50 transition-all"
                      data-testid="btn-submit-campaign"
                    >
                      {isPending ? 'Creating...' : 'Create Campaign'}
                    </button>
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
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
