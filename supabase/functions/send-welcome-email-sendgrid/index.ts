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

    // Email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .logo {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo h1 {
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 2.5rem;
            margin: 0;
            font-weight: bold;
          }
          .welcome {
            text-align: center;
            margin-bottom: 30px;
          }
          .welcome h2 {
            color: #4a5568;
            margin-bottom: 15px;
          }
          .content {
            margin-bottom: 30px;
          }
          .highlight {
            background: linear-gradient(45deg, #667eea, #764ba2);
            padding: 20px;
            border-radius: 15px;
            color: white;
            text-align: center;
            margin: 20px 0;
          }
          .links {
            text-align: center;
            margin: 30px 0;
          }
          .links a {
            display: inline-block;
            margin: 10px 15px;
            padding: 12px 25px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            transition: transform 0.3s ease;
          }
          .links a:hover {
            transform: translateY(-2px);
          }
          .footer {
            text-align: center;
            font-size: 14px;
            color: #666;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h1>prepAIred</h1>
          </div>
          
          <div class="welcome">
            <h2>🎉 Welcome to the prepAIred Community!</h2>
            <p>Thank you for joining our exclusive waitlist!</p>
          </div>
          
          <div class="content">
            <p>Hi there! 👋</p>
            
            <p>We're absolutely thrilled to have you on board! You've just secured your spot as one of the early adopters of <strong>prepAIred</strong> - the revolutionary AI-powered learning platform crafted by top IIT graduates.</p>
            
            <div class="highlight">
              <h3>🎁 Your Exclusive Welcome Gift</h3>
              <p>As a token of our appreciation, we've attached a special resource that will help you get started with AI-powered learning. Check your email attachments!</p>
            </div>
            
            <p>Here's what you can expect as we approach our launch on <strong>September 21st, 2025</strong>:</p>
            
            <ul>
              <li>🚀 <strong>Early Access</strong> - You'll be among the first to experience prepAIred</li>
              <li>📚 <strong>Exclusive Content</strong> - Special learning materials and resources</li>
              <li>💬 <strong>Community Access</strong> - Join our vibrant community of learners</li>
              <li>🎯 <strong>Personalized AI</strong> - Advanced AI tutoring tailored to your needs</li>
            </ul>
            
            <div class="links">
              <a href="https://www.reddit.com/r/pepAIre/" target="_blank">Join Reddit Community</a>
              <a href="https://discord.gg/csWBDZ2F" target="_blank">Join Discord Server</a>
            </div>
            
            <p>We'll keep you updated with exclusive previews, behind-the-scenes content, and important launch updates. Stay tuned!</p>
            
            <p>Thank you for believing in our vision. Together, we're going to revolutionize how students learn and succeed! 🎓✨</p>
            
            <p>Best regards,<br>
            <strong>The prepAIred Team</strong><br>
            <em>Crafted by IITians, for Students Everywhere</em></p>
          </div>
          
          <div class="footer">
            <p>© 2025 prepAIred Platform. Crafted with ❤️</p>
            <p>You're receiving this email because you joined our waitlist. We respect your privacy and will never spam you.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const plainText = `
🎉 Welcome to prepAIred!

Hi there!

Thank you for joining our exclusive waitlist! You've just secured your spot as one of the early adopters of prepAIred - the revolutionary AI-powered learning platform crafted by top IIT graduates.

🎁 Your Exclusive Welcome Gift
We've attached a special resource to help you get started with AI-powered learning!

What to expect:
• 🚀 Early Access - Be among the first to experience prepAIred
• 📚 Exclusive Content - Special learning materials and resources  
• 💬 Community Access - Join our vibrant community of learners
• 🎯 Personalized AI - Advanced AI tutoring tailored to your needs

Join our communities:
• Reddit: https://www.reddit.com/r/pepAIre/
• Discord: https://discord.gg/csWBDZ2F

Launch Date: September 21st, 2025

Thank you for believing in our vision!

Best regards,
The prepAIred Team
Crafted by IITians, for Students Everywhere
    `

    // SendGrid email payload
    const emailPayload = {
      personalizations: [
        {
          to: [
            {
              email: email,
              name: "Future prepAIred User"
            }
          ],
          subject: "🎉 Welcome to prepAIred - Your AI Learning Journey Starts Here!"
        }
      ],
      from: {
        email: Deno.env.get('SENDGRID_FROM_EMAIL') || "ishansrivastavaintraq1@gmail.com",
        name: "prepAIred Team"
      },
      reply_to: {
        email: "ishansrivastavaintraq1@gmail.com",
        name: "prepAIred Support"
      },
      content: [
        {
          type: "text/plain",
          value: plainText
        },
        {
          type: "text/html",
          value: emailHtml
        }
      ],
      attachments: [
        {
          content: pdfBase64,
          filename: "prepAIred-Welcome-Guide.pdf",
          type: "application/pdf",
          disposition: "attachment"
        }
      ]
    }

    // Debug: Log the email payload (without sensitive data)
    console.log('Sending email to:', email)
    console.log('From email:', Deno.env.get('SENDGRID_FROM_EMAIL'))
    console.log('API key starts with:', Deno.env.get('SENDGRID_API_KEY')?.substring(0, 10))
    
    // Send email using SendGrid
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    })

    console.log('SendGrid response status:', emailResponse.status)
    console.log('SendGrid response headers:', Object.fromEntries(emailResponse.headers.entries()))

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('SendGrid send failed:', errorText)
      throw new Error(`SendGrid send failed: ${errorText}`)
    }

    // SendGrid returns 202 for queued emails
    const messageId = emailResponse.headers.get('x-message-id') || 'sendgrid-' + Date.now()
    console.log('Email sent successfully via SendGrid:', messageId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Welcome email sent successfully via SendGrid',
        emailId: messageId,
        recipient: email,
        service: 'sendgrid'
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in send-welcome-email-sendgrid function:', error)
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