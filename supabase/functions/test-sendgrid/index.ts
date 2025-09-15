import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"

Deno.serve(async (req) => {
  try {
    const { email } = await req.json()
    
    console.log(`Testing SendGrid with email: ${email}`)
    
    // Simple test email
    const emailPayload = {
      personalizations: [
        {
          to: [{ email: email }],
          subject: "Test Email from prepAIred"
        }
      ],
      from: {
        email: "ishansrivastavaintraq1@gmail.com",
        name: "prepAIred Team"
      },
      content: [
        {
          type: "text/plain",
          value: "This is a simple test email to verify SendGrid is working correctly."
        },
        {
          type: "text/html",
          value: "<p>This is a <strong>simple test email</strong> to verify SendGrid is working correctly.</p>"
        }
      ]
    }

    console.log('API Key starts with:', Deno.env.get('SENDGRID_API_KEY')?.substring(0, 10))
    console.log('Payload:', JSON.stringify(emailPayload, null, 2))
    
    // Send email using SendGrid
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    })

    console.log('Response status:', emailResponse.status)
    console.log('Response headers:', Object.fromEntries(emailResponse.headers.entries()))
    
    const responseText = await emailResponse.text()
    console.log('Response body:', responseText)

    if (!emailResponse.ok) {
      throw new Error(`SendGrid failed: ${emailResponse.status} - ${responseText}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test email sent',
        status: emailResponse.status,
        recipient: email
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error:', error)
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