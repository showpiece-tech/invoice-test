import { NextResponse } from "next/server";
import invoiceData from "../../../../data/invoices.json";
import { ContextType } from "./route.types";

export async function GET(request: Request, context: ContextType) {
  const queryParams = new URLSearchParams(request.url);

  // Add filtration by Query Params
  const invoiceId = queryParams.get("invoiceId");

  const data = invoiceData.invoices.filter(
    ({ recipient, id }) =>
      recipient === context.params.id && (!invoiceId || id === invoiceId)
  );

  // Sort invoices by number
  const sortedInvoiceData = data.sort((a, b) => a.number - b.number);

  // Find discounted invoices and apply discount
  const discountedInvoices = sortedInvoiceData.map((invoice) => {
    let invoiceTotal = invoice.items.reduce(
      (cmValue, current) => (cmValue += current.price * current.quantity),
      0
    );

    // Convert price to dollar based
    invoiceTotal = invoiceTotal / 100;

    let discount = 0;

    // Apply discount to unpaid invoices
    if (!invoice.settled) {
      if (invoiceTotal >= 100) {
        discount = 10;
        invoiceTotal = invoiceTotal * 0.9;
      }
    }

    return { ...invoice, invoiceTotal, discount };
  });

  // Declare respose
  let response: NextResponse;

  if (discountedInvoices.length === 0)
    response = NextResponse.json(
      { error: `No invoices found for user: ${context.params.id}` },
      { status: 404 }
    );
  else
    response = NextResponse.json({
      data: discountedInvoices,
    });

  return response;
}

export async function DELETE(_request: Request, context: ContextType) {
  // Delete logic
  // We don't have access to any data source beside file, so I wont be implemeting logic for delete here
  return NextResponse.json(
    { message: `Item ${context.params.id} deleted` },
    { status: 200 }
  );
}
