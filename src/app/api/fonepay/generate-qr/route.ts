import { NextResponse } from 'next/server';
import { generateDynamicQr } from '@/lib/fonepay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = Number(body.amount);

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Valid payment amount is required' }, { status: 400 });
    }

    const result = await generateDynamicQr(amount, body.prn);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate Fonepay Dynamic QR' }, { status: 500 });
  }
}
