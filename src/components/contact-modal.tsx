import { useEffect, useRef, useActionState } from 'react'
import { X } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

type ContactModalProps = {
  open: boolean
  onClose: () => void
}

type FormState = { status: 'idle' | 'sent' | 'error'; subject?: string }

async function submitContact(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    })

    if (!res.ok) throw new Error()

    trackEvent('contact_form_submitted', { subject })
    return { status: 'sent', subject }
  } catch {
    return { status: 'error' }
  }
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [state, action, isPending] = useActionState(submitContact, {
    status: 'idle',
  })
  const dialogRef = useRef<HTMLDialogElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => onClose()
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose])

  useEffect(() => {
    if (state.status === 'sent') {
      formRef.current?.reset()
    }
  }, [state.status])

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-black/50 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Contact Support
        </h2>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {state.status === 'sent' ? (
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <svg
              className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Message sent!
          </p>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            We&apos;ll get back to you as soon as possible.
          </p>
          <button
            onClick={onClose}
            className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            Close
          </button>
        </div>
      ) : (
        <form ref={formRef} action={action} className="space-y-4 p-6">
          <div>
            <label
              htmlFor="contact-name"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-400"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-400"
            />
          </div>
          <div>
            <label
              htmlFor="contact-subject"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Subject
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-400"
            />
          </div>
          <div>
            <label
              htmlFor="contact-message"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-400"
            />
          </div>

          {state.status === 'error' && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Something went wrong. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </dialog>
  )
}
