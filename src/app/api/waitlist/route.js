import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const WAITLIST_FILE = path.join(process.cwd(), 'waitlist.json');

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    let waitlist = [];
    if (fs.existsSync(WAITLIST_FILE)) {
      const data = fs.readFileSync(WAITLIST_FILE, 'utf-8');
      if (data) {
        waitlist = JSON.parse(data);
      }
    }

    // Check if already exists
    if (waitlist.some(entry => entry.email === email)) {
      return NextResponse.json({ message: 'Email already on the waitlist' }, { status: 200 });
    }

    waitlist.push({ email, timestamp: new Date().toISOString() });
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify(waitlist, null, 2));

    return NextResponse.json({ message: 'Successfully joined the waitlist' }, { status: 201 });
  } catch (error) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req) {
  // A simple endpoint to view the waitlist data
  try {
    let waitlist = [];
    if (fs.existsSync(WAITLIST_FILE)) {
      const data = fs.readFileSync(WAITLIST_FILE, 'utf-8');
      if (data) {
        waitlist = JSON.parse(data);
      }
    }
    return NextResponse.json({ total: waitlist.length, waitlist }, { status: 200 });
  } catch (error) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
