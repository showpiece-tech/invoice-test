export interface Customer {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface LineItem {
  title: string;
  description: string;
  price: number;
  quantity: number;
}

export interface Invoice {
  id: string;
  number: number;
  dateIssued: Date;
  dateDue: Date;
  settled: Boolean;
  recipient: string;
  patron: string;
  items: LineItem[];
  invoiceTotal: number;
  discount?: number;
}

export const formatDateValue = (value: Date) => {
  const dateValue = new Date(value);
  return dateValue.toLocaleDateString("en-GB").replace(/\//g, "-");
};

// Function to calculate totals when invoices content changes
export const calculateTotals = (invoices: Invoice[]) => {
  let invoicesDiscountTotal = 0;
  let invoicesTotal = 0;
  let invoicesPaidTotal = 0;
  let invoicesOwedTotal = 0;

  invoices.forEach((invoice) => {
    invoicesTotal += invoice.invoiceTotal;
    if (invoice.discount && invoice.discount > 0) {
      invoicesOwedTotal += invoice.invoiceTotal;
      invoicesDiscountTotal += (invoice.invoiceTotal * invoice.discount) / 100;
    } else invoicesPaidTotal += invoice.invoiceTotal;
  });
  return {
    invoicesDiscountTotal,
    invoicesOwedTotal,
    invoicesPaidTotal,
    invoicesTotal,
  };
};
