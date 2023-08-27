import { NextResponse } from "next/server";
import invoiceData from "../../../../data/invoices.json";
import { Invoice } from "@/utils/data-helpers";

interface ParamType {
  customerId: string;
}

interface ContextType {
  params: ParamType;
}

export async function GET(_request: Request, context: ContextType) {
  const data: Invoice[] = invoiceData.invoices.filter(
    ({ recipient }) => recipient === context.params.customerId
  ) as Invoice[];

  // Sort data by invoice number
  data.sort((a, b) => a.number - b.number);

  // Apply a 10% discount to all invoices with a sum of all items greater than 10000 ($100)
  data.forEach((invoice, index) => {
    if (invoice.settled) return;

    const sumOfAllItemsInCents = invoice.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    if (sumOfAllItemsInCents > 10000) {
      data[index].discount = 0.1;
    }
  });

  return NextResponse.json(
    { data, error: data.length ? undefined : "No invoices found" },
    { status: data.length ? 200 : 404 }
  );
}
