import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('API Route hit');

    const formData = await request.formData();
    console.log('Form Data received:', Object.fromEntries(formData));

    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || !email || !message) {
      console.error('Missing form data:', { name, email, message });
      return NextResponse.json({ error: 'Missing form data' }, { status: 400 });
    }

    console.log('Form Data:', { name, email, message });

    const formSubmitUrl = `https://formsubmit.co/${process.env.ADMIN_EMAIL_1}`;

    const res = await fetch(formSubmitUrl, {
      method: 'POST',
      body: new URLSearchParams({
        name,
        email,
        message,
        _subject: 'New message from your website visitor',
        _next: 'https://atkinson-art.netlify.app/thank-you'
      })
    });

    if (!res.ok) {
      console.error('Error from Formsubmit:', res.status, res.statusText);
      return NextResponse.json({ error: 'Formsubmit error' }, { status: 500 });
    }

    return NextResponse.redirect('https://atkinson-art.netlify.app/thank-you');
  } catch (error) {
    console.error('Error in API Route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
