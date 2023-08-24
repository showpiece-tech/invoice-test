import { NextResponse } from 'next/server'
import invoiceData from '@/data/invoices.json';

interface ParamType {
  id: string;
}

interface ContextType {
  params: ParamType
}

export async function GET(request: Request, context: ContextType) {
  const data = invoiceData.invoices
    .filter(({recipient}) => recipient === context.params.id );

  return NextResponse.json({ data })
}