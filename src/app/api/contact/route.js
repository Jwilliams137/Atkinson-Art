import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('API Route hit');

    // Attempt to parse form data
    const formData = await request.formData();
    console.log('Form Data received:', Object.fromEntries(formData));

    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Check for missing form data
    if (!name || !email || !message) {
      console.error('Missing form data:', { name, email, message });
      return NextResponse.json({ error: 'Missing form data' }, { status: 400 });
    }

    // Log form data for debugging
    console.log('Form Data:', { name, email, message });

    // Formsubmit URL
    const formSubmitUrl = 'https://formsubmit.co/jwilliams137.036@gmail.com';

    // Send the data to Formsubmit
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

    // Handle error if Formsubmit response is not OK
    if (!res.ok) {
      console.error('Error from Formsubmit:', res.status, res.statusText);
      return NextResponse.json({ error: 'Formsubmit error' }, { status: 500 });
    }

    // Successfully submitted, redirect to thank-you page
    return NextResponse.redirect('https://atkinson-art.netlify.app/thank-you');
  } catch (error) {
    console.error('Error in API Route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
