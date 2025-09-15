import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: any
  schema: string
  old_record: any
}

Deno.serve(async (req) => {
  try {
    const payload: WebhookPayload = await req.json()
    
    // Only process INSERT events on waitlist table
    if (payload.type !== 'INSERT' || payload.table !== 'waitlist') {
      return new Response('OK', { status: 200 })
    }

    const { email, id, serial_number } = payload.record
    console.log(`Sending welcome email to: ${email}`)

    // Get the PDF file as base64
    const pdfUrl = `${Deno.env.get('SITE_URL')}/iter8.pdf`
    const pdfResponse = await fetch(pdfUrl)
    
    if (!pdfResponse.ok) {
      console.error('Failed to fetch PDF file')
      throw new Error('Failed to fetch PDF file')
    }

    const pdfBuffer = await pdfResponse.arrayBuffer()
    const pdfBytes = new Uint8Array(pdfBuffer)
    
    // Convert to base64 in chunks to avoid call stack overflow
    let binary = ''
    const chunkSize = 8192
    for (let i = 0; i < pdfBytes.length; i += chunkSize) {
      const chunk = pdfBytes.slice(i, i + chunkSize)
      binary += String.fromCharCode(...chunk)
    }
    const pdfBase64 = btoa(binary)

    // Email content (simplified for EmailJS)
    const emailData = {
      service_id: Deno.env.get('EMAILJS_SERVICE_ID'),
      template_id: Deno.env.get('EMAILJS_TEMPLATE_ID'),
      user_id: Deno.env.get('EMAILJS_PUBLIC_KEY'),
      accessToken: Deno.env.get('EMAILJS_PRIVATE_KEY'),
      template_params: {
        to_email: email,
        to_name: 'Future prepAIred User',
        subject: '🎉 Welcome to prepAIred - Your AI Learning Journey Starts Here!',
        message: `Hi there! 👋

We're absolutely thrilled to have you on board! You've just secured your spot as one of the early adopters of prepAIred - the revolutionary AI-powered learning platform crafted by top IIT graduates.

🎁 Your Exclusive Welcome Gift
As a token of our appreciation, we've prepared special resources to help you get started with AI-powered learning.

Here's what you can expect as we approach our launch on September 21st, 2025:

🚀 Early Access - You'll be among the first to experience prepAIred
📚 Exclusive Content - Special learning materials and resources
💬 Community Access - Join our vibrant community of learners
🎯 Personalized AI - Advanced AI tutoring tailored to your needs

Join our communities:
• Reddit: https://www.reddit.com/r/pepAIre/
• Discord: https://discord.gg/csWBDZ2F

We'll keep you updated with exclusive previews, behind-the-scenes content, and important launch updates. Stay tuned!

Thank you for believing in our vision. Together, we're going to revolutionize how students learn and succeed! 🎓✨

Best regards,
The prepAIred Team
Crafted by IITians, for Students Everywhere`,
        // Note: EmailJS doesn't support attachments directly
        // You would need to host the PDF publicly and include a download link
        pdf_download_link: `${Deno.env.get('SITE_URL')}/iter8.pdf`
      }
    }

    // Send email using EmailJS
    const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('EmailJS send failed:', errorText)
      throw new Error(`EmailJS send failed: ${errorText}`)
    }

    console.log('Email sent successfully via EmailJS')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Welcome email sent successfully via EmailJS',
        recipient: email,
        service: 'emailjs',
        note: 'PDF available as download link (EmailJS doesn\'t support direct attachments)'
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in send-welcome-email-emailjs function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})