// File: src/app/api/contact/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extracting data from the form
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Now you can either send this data to Formsubmit or handle it in some other way
    // For example, if you're sending this to Formsubmit, you could use a fetch request

    const formSubmitUrl = 'https://formsubmit.co/jwilliams137.036@gmail.com';

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
      return NextResponse.error();
    }

    return NextResponse.redirect('/thank-you'); // Redirect to the thank-you page

  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
