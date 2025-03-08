import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL_1);

  try {
    console.log('API Route hit');

    // Ensure environment variable is set
    const adminEmail = process.env.ADMIN_EMAIL_1;
    if (!adminEmail) {
      console.error("ADMIN_EMAIL is not configured");
      return NextResponse.json({ error: "Admin email is missing" }, { status: 500 });
    }
    
    // Parse form data
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || !email || !message) {
      console.error('Missing form data:', { name, email, message });
      return NextResponse.json({ error: 'Missing form data' }, { status: 400 });
    }

    console.log('Form Data:', { name, email, message });

    // FormSubmit URL with the correct environment variable
    const formSubmitUrl = `https://formsubmit.co/${adminEmail}`;

    const res = await fetch(formSubmitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        name,
        email,
        message,
        _subject: 'New message from your website visitor',
        _next: 'https://atkinson-art.netlify.app/thank-you'
      })
    });

    if (!res.ok) {
      console.error('Error from FormSubmit:', res.status, res.statusText);
      return NextResponse.json({ error: 'FormSubmit error' }, { status: 500 });
    }

    return NextResponse.redirect('https://atkinson-art.netlify.app/thank-you');
  } catch (error) {
    console.error('Error in API Route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
