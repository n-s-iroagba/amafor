'use client'

import { Header } from '@/shared/components/Header'
import { Footer } from '@/shared/components/Footer'
import { Mail, Phone, MapPin, MessageCircle, HelpCircle } from 'lucide-react'
import { useState } from 'react'

export default function HelpContact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    }, 3000)
  }

  const faqs = [
    {
      question: 'How can I support the club financially?',
      answer: 'You can support us through one-time donations or by becoming a patron with monthly/yearly subscriptions. Visit our Support page to learn about different patron tiers and benefits.'
    },
    {
      question: 'How do I apply for Pro View access?',
      answer: 'Professional scouts can apply through our Pro View Access page. You\'ll need to provide your credentials, organization details, and social media profile. Applications are reviewed within 24-48 hours.'
    },
    {
      question: 'How can I advertise with the club?',
      answer: 'Register as an advertiser through our Advertise page. After verification, you can create campaigns targeting specific ad zones with transparent per-view pricing.'
    },
    {
      question: 'How do I join the academy?',
      answer: 'Visit our Academy section for information about our youth development program. You can contact us via WhatsApp or email for trial dates and enrollment details.'
    },
    {
      question: 'Where can I buy match tickets?',
      answer: 'Match tickets can be purchased through our official ticketing partners. Check individual fixture pages for ticket availability and pricing.'
    },
    {
      question: 'How do I stay updated with club news?',
      answer: 'Follow us on social media (Facebook, Twitter, Instagram, YouTube) and check our News section regularly for the latest updates, match reports, and announcements.'
    },
    {
      question: 'Can I volunteer with the club?',
      answer: 'We welcome volunteers! Contact us through the form below or via email to learn about current volunteer opportunities.'
    },
    {
      question: 'How can I report a technical issue?',
      answer: 'Please use the contact form below or email support@amaforgladiatorsfc.com with details about the issue you\'re experiencing.'
    }
  ]

  return (
    <>
      <Header />
      
      <main className="py-16 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-heading text-sky-500 mb-2">Help & Contact</h1>
            <div className="h-1 w-16 bg-sky-700 mx-auto mb-6"></div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Have a question? We're here to help. Check our FAQs or get in touch with our team.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white border border-slate-200 p-8 rounded-lg shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-7 h-7 text-sky-700" />
                <h2 className="text-2xl font-heading text-sky-500">Send Us a Message</h2>
              </div>

              {submitted && (
                <div className="bg-sky-50 border border-sky-200 text-sky-900 p-4 rounded-lg mb-6">
                  <p className="font-semibold">Message sent successfully!</p>
                  <p className="text-sm mt-1">We'll get back to you as soon as possible.</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-sky-500 mb-2">Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-sky-500 mb-2">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-sky-500 mb-2">Subject *</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-sky-500 mb-2">Message *</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 min-h-32"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!name || !email || !subject || !message}
                  className="w-full bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info & FAQs */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white border border-slate-200 p-8 rounded-lg shadow-card">
                <h2 className="text-2xl font-heading text-sky-500 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-sky-700 mt-1" />
                    <div>
                      <div className="font-semibold text-sky-500">Email</div>
                      <a href="mailto:info@amaforgladiatorsfc.com" className="text-sky-700 hover:text-sky-800">
                        info@amaforgladiatorsfc.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-sky-700 mt-1" />
                    <div>
                      <div className="font-semibold text-sky-500">Phone</div>
                      <a href="tel:+234XXXXXXXXXX" className="text-sky-700 hover:text-sky-800">
                        +234 XXX XXX XXXX
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-sky-700 mt-1" />
                    <div>
                      <div className="font-semibold text-sky-500">Address</div>
                      <p className="text-slate-600">
                        Amafor Gladiators FC Stadium<br />
                        Lagos, Nigeria
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick FAQs */}
              <div className="bg-white border border-slate-200 p-8 rounded-lg shadow-card">
                <div className="flex items-center gap-3 mb-6">
                  <HelpCircle className="w-7 h-7 text-sky-700" />
                  <h2 className="text-2xl font-heading text-sky-500">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-4">
                  {faqs.slice(0, 4).map((faq, index) => (
                    <div key={index} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                      <h3 className="font-semibold text-sky-500 mb-2">{faq.question}</h3>
                      <p className="text-sm text-slate-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
