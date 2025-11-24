import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { track } from '@vercel/analytics'

declare global {
  interface Window {
    posthog: any
  }
}

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    // Check initial scroll position on mount
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)

    // If we're not on the homepage, navigate there first
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`
      return
    }

    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleLogoClick = () => {
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.location.href = '/'
    }
  }

  const handleDownloadClick = () => {
    track('click_download', {
      location: 'header',
    })
    if (window.posthog) {
      window.posthog.capture('click_download', {
        location: 'header',
      })
    }
    scrollToSection('download')
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-400 blur-md opacity-50"></div>
            S
          </div>
          <span
            className={`text-2xl font-bold tracking-tight ${
              isScrolled ? 'text-slate-900' : 'text-slate-900'
            }`}
          >
            Suri
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it Works'].map((item) => (
            <button
              key={item}
              onClick={() =>
                scrollToSection(item.toLowerCase().replace(/\s/g, '-'))
              }
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              {item}
            </button>
          ))}
          <button
            onClick={handleDownloadClick}
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-emerald-600 transition-all hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            Download App
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col p-6 gap-4">
          {['Features', 'How it Works'].map((item) => (
            <button
              key={item}
              onClick={() =>
                scrollToSection(item.toLowerCase().replace(/\s/g, '-'))
              }
              className="text-left text-lg font-medium text-slate-600"
            >
              {item}
            </button>
          ))}
          <button
            onClick={handleDownloadClick}
            className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg"
          >
            Download App
          </button>
        </div>
      </div>
    </nav>
  )
}
