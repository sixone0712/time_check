import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  try {
    const session = (await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET,
    })) as any;

    if (session?.name ?? false) {
      return NextResponse.redirect(new URL('/time', req.url));
    }
    return NextResponse.next();
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return NextResponse.next();
}
