import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { secret, path = "/" } = await req.json().catch(() => ({}));
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, message: "Invalid token" }, { status: 401 });
  }
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path });
  } catch (e) {
    return NextResponse.json({ revalidated: false, message: String(e) }, { status: 500 });
  }
}
