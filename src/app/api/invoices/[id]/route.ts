import { NextResponse } from "next/server";
import invoiceData from "@/data/invoices.json";
import { Invoice } from "@/utils/data-helpers";

interface ParamType {
  id: string;
}

interface ContextType {
  params: ParamType;
}

export async function GET(request: Request, context: ContextType) {
  const data = invoiceData.invoices.filter(
    ({ recipient }) => recipient === context.params.id
  );

  // sort by invoice number
  data.sort((a, b) => a.number - b.number);

  // Add a discount of 10% to all invoices that are unpaid and are more than $100 in total
  const result = data.map((invoice) => {
    const totalPrice = invoice.items.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.price * currentItem.quantity;
    }, 0);

    // Add discount percentage
    let discount = 0;
    if (!invoice.settled && totalPrice > 10000) {
      discount = 10;
    }

    return { ...invoice, discount };
  });

  // todo: check that the right error message is returned
  return NextResponse.json(
    { data: result },
    { status: data.length > 0 ? 200 : 404 }
  );
}
