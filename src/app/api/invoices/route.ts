import { NextResponse } from 'next/server'
import invoiceData from '../../../data/invoices.json';

export async function GET(request: Request) {
  if ( !invoiceData.invoices || invoiceData.invoices.length == 0 ){
    return NextResponse.json({
      status: 404,
      message: 'Data not found',
    });
  }
  const data = invoiceData.invoices.sort((a,b)=>a.number-b.number);
  return NextResponse.json({ data })
}
