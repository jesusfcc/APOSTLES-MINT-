import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    "accountAssociation": {
      "header": "eyJmaWQiOjI4NTUsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgzMjEzN2YwRDVBNjgxYzJCQkIzQzAxQkRGNWI2ZTNjMzcxNUREMmRBIn0",
      "payload": "eyJkb21haW4iOiJhcG9zdGxlLW1pbnQudmVyY2VsLmFwcCJ9",
      "signature": "jJ9bh4XFvITjeqVk7iis1istK63oB7lvfBnISb0xovk/tezrNN/AzI0yZgxTZBJA+CYXN0RizVqQCyJqZPorqRw="
    },
    "frame": {
      "version": "1",
      "name": "Example Frame",
      "iconUrl": "https://apostle-mint.vercel.app/icon.png",
      "homeUrl": "https://apostle-mint.vercel.app",
      "imageUrl": "https://apostle-mint.vercel.app/image.png",
      "buttonTitle": "Check this out",
      "splashImageUrl": "https://apostle-mint.vercel.app/splash.png",
      "splashBackgroundColor": "#eeccff",
      "webhookUrl": "https://apostle-mint.vercel.app/api/webhook"
    }
  });
}
