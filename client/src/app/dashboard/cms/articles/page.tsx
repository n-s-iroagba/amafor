'use client';
import React from 'react';
import { FileText, PlusCircle, ArrowLeft, Search, Filter, Edit3, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { MOCK_ARTICLES } from '../../../../constants';

export default function CMSArticlesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/dashboard/cms" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Suite
        </Link>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl text-[#2F4F4F] mb-2 uppercase tracking-tight font-black">EDITORIAL INVENTORY</h1>
            <p className="text-gray-500 text-sm">Review, edit, and publish content for the Gladiators digital feed.</p>
          </div>
          <Link href="/dashboard/cms/articles/new" className="sky-button flex items-center space-x-3 py-4">
            <PlusCircle className="w-5 h-5" />
            <span>NEW ARTICLE</span>
          </Link>
        </header>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm mb-12 flex flex-wrap items-center gap-8 border border-gray-100">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search by title or author..." className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#87CEEB] text-sm" />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select className="bg-gray-50 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-[#2F4F4F] border-none outline-none">
              <option>All Statuses</option>
              <option>Published</option>
              <option>Draft</option>
              <option>Pending Review</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#2F4F4F] text-[#87CEEB]">
              <tr className="text-[10px] font-black uppercase tracking-widest">
                <th className="px-10 py-6">Article</th>
                <th className="px-10 py-6">Author</th>
                <th className="px-10 py-6">Published Date</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_ARTICLES.map(article => (
                <tr key={article.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <img src={article.featuredImage} className="w-full h-full object-cover" />
                      </div>
                      <div className="max-w-xs">
                        <div className="font-bold text-[#2F4F4F] truncate">{article.title}</div>
                        <div className="text-[9px] font-black text-[#87CEEB] uppercase tracking-widest mt-1">{article.tags[0]}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-xs font-bold text-[#2F4F4F]">{article.author}</td>
                  <td className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                      Published
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/dashboard/cms/articles/${article.id}`} className="p-3 bg-gray-50 text-gray-400 hover:text-[#2F4F4F] hover:bg-[#87CEEB]/20 rounded-xl transition-all">
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}