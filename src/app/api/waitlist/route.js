import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    const { email, _gotcha } = data;

    // 1. Basic Server-Side Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // 2. Honeypot Bot Protection 
    // Bots scan forms and automatically fill out all fields. Normal humans can't see the hidden _gotcha field.
    // If this field has text, it's 100% a bot. We silently return success so the bot thinks it worked.
    if (_gotcha) {
      return NextResponse.json({ message: 'Successfully joined the waitlist' }, { status: 201 });
    }

    // 3. Securely forward the request to Formspree 
    // Doing this on the server completely hides the Formspree URL from the browser's Network tab.
    const FORMSPREE_URL = "https://formspree.io/f/xnjkqjgn";
    
    const formspreeRes = await fetch(FORMSPREE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ email })
    });

    if (formspreeRes.ok) {
      return NextResponse.json({ message: 'Successfully joined the waitlist' }, { status: 201 });
    } else {
      console.error('Formspree rejected the request:', await formspreeRes.text());
      return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
    }

  } catch (error) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
