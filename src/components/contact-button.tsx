import { useState, useCallback } from 'react'
import ContactModal from './contact-modal'
import { trackEvent } from '@/lib/analytics'

export default function ContactButton() {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
    trackEvent('cta_click', { type: 'contact_support', location: 'faq' })
  }

  const handleClose = useCallback(() => setOpen(false), [])

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium underline underline-offset-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
      >
        Contact our support team
      </button>
      <ContactModal open={open} onClose={handleClose} />
    </>
  )
}
