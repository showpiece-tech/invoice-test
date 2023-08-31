import { Invoice } from "@/utils/data-helpers";

// Function to get Invoices Details from API
export const fetchInvoices = async (
  userId: string
): Promise<Invoice[] | undefined> => {
  try {
    const response = await fetch(`/api/invoices/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// Function to delete invoice using API
export const deleteInvoice = async (
  invoiceId: string
): Promise<number | undefined> => {
  try {
    const response = await fetch(`/api/invoices/${invoiceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.status;
  } catch (error) {
    console.error(error);
  }
};
