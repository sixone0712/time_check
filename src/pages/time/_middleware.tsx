import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  console.log('==middleware====session============');
  try {
    const session = (await getToken({
      req: req as any,
      secret: 'chpark',
    })) as any;
    console.log(session);
    console.log(req.page);

    console.log('session?.name', session?.name ?? 'no!!!');
    if (!(session?.name ?? false)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
