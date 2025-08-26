export interface Customer {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface Company {
  id: string;
  company: string;
  logo: string;
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
  discount?: number;
}
