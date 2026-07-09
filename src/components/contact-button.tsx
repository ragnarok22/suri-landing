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
        className="text-teal dark:text-lime hover:text-teal-deep dark:hover:text-lime-deep font-bold underline underline-offset-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime rounded"
      >
        Contact our support team
      </button>
      <ContactModal open={open} onClose={handleClose} />
    </>
  )
}
