export async function GET() {
    return Response.json({
      restrictedUsers: [
        process.env.ADMIN_EMAIL_1,
        process.env.ADMIN_EMAIL_2
      ]
    });
  }  