"use client"

import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Contact Us</h1>
          </div>
          <p className="text-gray-500">We&apos;re here to help. Reach out through any of the channels below.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <Phone className="h-4 w-4 text-blue-400" />
              </div>
              <h2 className="text-white font-semibold">Phone</h2>
            </div>
            <p className="text-gray-400 text-sm mb-1">Call or WhatsApp us</p>
            <a href="tel:+97140000000" className="text-white font-medium hover:text-blue-400 transition-colors">+971 4 000 0000</a>
          </div>

          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <Mail className="h-4 w-4 text-blue-400" />
              </div>
              <h2 className="text-white font-semibold">Email</h2>
            </div>
            <p className="text-gray-400 text-sm mb-1">We reply within 24 hours</p>
            <a href="mailto:support@quickcart.ae" className="text-white font-medium hover:text-blue-400 transition-colors">support@quickcart.ae</a>
          </div>

          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-blue-400" />
              </div>
              <h2 className="text-white font-semibold">Address</h2>
            </div>
            <p className="text-gray-400 text-sm mb-1">Visit our showroom</p>
            <p className="text-white font-medium">Business Bay, Dubai, UAE</p>
          </div>

          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-400" />
              </div>
              <h2 className="text-white font-semibold">Working Hours</h2>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Mon – Thu</span>
                <span className="text-white">9:00 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Saturday</span>
                <span className="text-white">10:00 AM – 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Friday &amp; Sunday</span>
                <span className="text-red-400">Closed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
          <h2 className="text-white font-semibold text-lg mb-5">Send Us a Message</h2>
          {sent && (
            <div className="mb-5 p-4 rounded-lg bg-green-600/10 border border-green-600/20 text-green-400 text-sm">
              Message sent! We'll get back to you within 24 hours.
            </div>
          )}
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-400 text-sm">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full h-10 rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400 text-sm">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-10 rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-400 text-sm">Subject</label>
              <input
                type="text"
                placeholder="Order enquiry, return, warranty..."
                className="w-full h-10 rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-400 text-sm">Message</label>
              <textarea
                rows={5}
                placeholder="Describe your issue or question in detail..."
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
