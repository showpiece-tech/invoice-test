import { NextResponse } from "next/server";
import { Invoice } from "@/utils/data-helpers";
import fs from "fs";

interface ParamType {
  customerId: string;
  invoiceId: string;
}

interface ContextType {
  params: ParamType;
}

export async function DELETE(_request: Request, context: ContextType) {
  let fileName = "invoices.json";
  // If the node environment is test then make a copy of the file
  if (process.env.NODE_ENV === "test") {
    fileName = "invoices-copy.json";

    // Delete the copy if it exists
    if (fs.existsSync("./src/data/invoices-copy.json"))
      fs.unlinkSync("./src/data/invoices-copy.json");

    fs.copyFileSync(
      "./src/data/invoices-backup.json",
      "./src/data/invoices-copy.json"
    );
  }

  const invoiceData = require(`../../../../../data/${fileName}`);
  console.log(invoiceData.invoices.length);
  console.log(process.env.NODE_ENV);

  const invoice = invoiceData.invoices.find(
    ({ id }: { id: string }) => id === context.params.invoiceId
  ) as Invoice;

  // If the invoice does not exist, return an error
  if (!invoice) {
    return NextResponse.json(
      {
        message: `Invoice ${context.params.invoiceId} does not exist`,
      },
      { status: 404 }
    );
  }

  // If the invoice is settled, return an error
  if (invoice.settled) {
    return NextResponse.json(
      {
        message: `Invoice ${context.params.invoiceId} cannot be deleted as it is settled`,
      },
      { status: 400 }
    );
  }

  // Filter out the invoice
  invoiceData.invoices = invoiceData.invoices.filter(
    ({ id }: { id: string }) => id !== context.params.invoiceId
  );

  try {
    // Write the new data to the file
    fs.writeFileSync(
      `./src/data/${fileName}`,
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
