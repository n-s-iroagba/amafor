'use client';

import { Star, Heart, Bookmark, Settings, Trophy, Shield, Calendar, Gift } from 'lucide-react';
import Link from 'next/link';

export default function FanDashboard() {
  const contributions = [
    { id: 'tx1', type: 'Donation', amount: '₦5,000', date: 'May 12, 2024', status: 'Completed' },
    { id: 'tx2', type: 'Membership', amount: '₦2,500', date: 'April 1, 2024', status: 'Active' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mini Sidebar */}
      <aside className="w-20 bg-[#2F4F4F] hidden lg:flex flex-col items-center py-8 space-y-8">
        <div className="bg-[#87CEEB] p-2 rounded-lg"><Star className="w-6 h-6 text-[#2F4F4F]" /></div>
        <div className="space-y-6">
          <Link href="/dashboard/fan/profile" className="p-3 text-white/50 hover:text-white block"><Settings className="w-6 h-6" /></Link>
          <Link href="/support/donate" className="p-3 text-white/50 hover:text-white block"><Heart className="w-6 h-6" /></Link>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="text-[10px] font-black text-[#87CEEB] uppercase tracking-[0.3em] mb-2">Gladiator Fan Experience</div>
            <h1 className="text-4xl text-[#2F4F4F]">Welcome, Chinedu!</h1>
          </div>
          <div className="bg-[#2F4F4F] text-white px-6 py-3 rounded-2xl flex items-center space-x-4">
             <Trophy className="w-5 h-5 text-[#87CEEB]" />
             <div>
               <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Membership Status</div>
               <div className="text-xs font-bold uppercase tracking-widest">GOLD SUPPORTER</div>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Fan Feed */}
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
               <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-10 flex items-center">
                 <Bookmark className="w-4 h-4 mr-2 text-[#87CEEB]" /> Saved for Later
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2].map(i => (
                    <div key={i} className="group cursor-pointer">
                      <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-4">
                        <img src={`https://picsum.photos/seed/${i+10}/400/225`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <h4 className="font-bold text-[#2F4F4F] group-hover:text-[#87CEEB] transition-colors line-clamp-1">Match Report: Gladiators v Port Harcourt</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Saved 2 days ago</p>
                    </div>
                  ))}
               </div>
            </section>

            <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
               <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-10 flex items-center">
                 <Calendar className="w-4 h-4 mr-2 text-[#87CEEB]" /> Contribution History
               </h2>
               <div className="space-y-4">
                 {contributions.map(tx => (
                   <div key={tx.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                     <div className="flex items-center space-x-6">
                       <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2F4F4F] shadow-sm">
                         {tx.type === 'Donation' ? <Heart className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                       </div>
                       <div>
                         <div className="text-xs font-black text-[#2F4F4F] uppercase tracking-widest">{tx.type}</div>
                         <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{tx.date}</div>
                       </div>
                     </div>
                     <div className="text-right">
                        <div className="text-sm font-black text-[#2F4F4F]">{tx.amount}</div>
                        <div className="text-[9px] text-green-500 font-black uppercase tracking-widest">{tx.status}</div>
                     </div>
                   </div>
                 ))}
               </div>
               <button className="w-full mt-8 py-4 bg-gray-100 hover:bg-[#87CEEB] hover:text-[#2F4F4F] transition-all rounded-2xl text-[9px] font-black uppercase tracking-widest">
                  DOWNLOAD FULL STATEMENT
               </button>
            </section>
          </div>

          {/* Exclusive Offers Sidebar */}
          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-xl">
               <Gift className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
               <h3 className="text-xl font-black mb-6 uppercase tracking-tight text-[#87CEEB]">Member Perk</h3>
               <p className="text-sm text-gray-400 leading-relaxed mb-8">
                 Your Gold Membership entitles you to <span className="text-white font-bold">15% off</span> the new 2024 Home Kit.
               </p>
               <button className="w-full py-4 bg-[#87CEEB] text-[#2F4F4F] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                  REDEEM VOUCHER
               </button>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
               <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Shield className="w-8 h-8 text-blue-500" />
               </div>
               <h4 className="text-sm font-black text-[#2F4F4F] uppercase tracking-tight mb-2">Verified Gladiator</h4>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                 You are an official member of the Amafor community.
               </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
