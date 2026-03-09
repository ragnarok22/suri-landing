import type { APIRoute } from 'astro'
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body as {
      name: string
      email: string
      subject: string
      message: string
    }

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    await resend.emails.send({
      from: 'Suri Support <no-reply@suriapp.sr>',
      to: 'me@reinierhernandez.com',
      replyTo: email,
      subject: `[Suri Contact] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    })

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed to send message. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
