import { Invoice } from "./data-helpers";

export interface InvoiceReturnType {
  amount: number;
  discounted: boolean;
}

export const getInvoiceAmount = (invoice: Invoice): number => {
  const sumOfAllItemsInCents = invoice.items.reduce((acc, item) => {
    return acc + item.price * item.quantity * (1 - (invoice.discount || 0));
  }, 0);

  return sumOfAllItemsInCents / 100;
};

export const getInvoiceDiscount = (invoice: Invoice): number => {
  const sumOfAllDiscountsInCents = invoice.items.reduce((acc, item) => {
    return acc + item.price * item.quantity * (invoice.discount || 0);
  }, 0);

  return sumOfAllDiscountsInCents / 100;
};

export const getSumOfIvoices = (
  invoices: Invoice[],
  calculatedOnlySettledInvoices: boolean = false
): number => {
  const sumOfAllInvoices = invoices.reduce((acc, invoice) => {
    if (calculatedOnlySettledInvoices && !invoice.settled) {
      return acc;
    }
    return acc + getInvoiceAmount(invoice);
  }, 0);

  return sumOfAllInvoices;
};

export const getSumOfAllDiscounts = (invoices: Invoice[]): number => {
  const sumOfAllDiscounts = invoices.reduce((acc, invoice) => {
    return acc + getInvoiceDiscount(invoice);
  }, 0);

  return sumOfAllDiscounts;
};
