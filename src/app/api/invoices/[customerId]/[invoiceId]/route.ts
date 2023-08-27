import { NextResponse } from "next/server";
import invoiceData from "../../../../../data/invoices.json";
import { Invoice } from "@/utils/data-helpers";
import fs from "fs";

interface ParamType {
  invoiceId: string;
}

interface ContextType {
  params: ParamType;
}

export async function DELETE(_request: Request, context: ContextType) {
  // If the invoice is settled, return an error
  const invoice = invoiceData.invoices.find(
    ({ id }) => id === context.params.invoiceId
  ) as Invoice;
  if (invoice.settled) {
    return NextResponse.json(
      {
        message: `Invoice ${context.params.invoiceId} has been settled and cannot be deleted`,
      },
      { status: 400 }
    );
  }

  // Remove the invoice
  invoiceData.invoices = invoiceData.invoices.filter(
    ({ id }) => id !== context.params.invoiceId
  );

  try {
    // Write the new data to the file
    fs.writeFileSync(
      "./data/invoices.json",
      JSON.stringify(invoiceData, null, 2)
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        message: `Invoice ${context.params.invoiceId} could not be deleted`,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: `Invoice ${context.params.invoiceId} has been deleted`,
  });
}
