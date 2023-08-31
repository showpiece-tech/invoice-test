import { Invoice, InvoiceAPIRespose } from "@/utils/data-helpers";

export const fetchInvoices = async (
  userId: string
): Promise<InvoiceAPIRespose | undefined> => {
  try {
    const response = await fetch(`/api/invoices/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const invoicesData = await response.json();
    console.log(invoicesData);
    return invoicesData;
  } catch (error) {
    console.error(error);
  }
};
