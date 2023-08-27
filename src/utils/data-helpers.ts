import { faker } from "@faker-js/faker";

export interface Customer {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
}
export const createCustomer = (): Customer => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    address: faker.location.streetAddress(),
    email: faker.internet.email(),
    phone: faker.phone.imei(),
  };
};

interface Company {
  id: string;
  company: string;
  logo: string;
  address: string;
  email: string;
  phone: string;
}
export const createCompany = (): Company => {
  return {
    id: faker.string.uuid(),
    company: faker.company.name(),
    logo: faker.image.urlLoremFlickr({
      category: "nature",
      width: 350,
      height: 350,
    }),
    address: faker.location.streetAddress(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  };
};

export interface LineItem {
  title: string;
  description: string;
  price: number;
  quantity: number;
}
export const createLineItem = (): LineItem => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.number.int({ min: 20, max: 250 }),
    quantity: faker.number.int({ min: 1, max: 15 }),
  };
};

export interface Invoice {
  id: string;
  number: number;
  dateIssued: Date | string;
  dateDue: Date | string;
  settled: Boolean;
  recipient: string;
  patron: string;
  items: LineItem[];
  discount?: number;
}
export const createInvoice = (
  customer: string,
  company: string,
  lineItems: number
): Invoice => {
  let items: LineItem[] = [];

  for (let i = 0; i < lineItems; i++) {
    items.push(createLineItem());
  }

  return {
    id: faker.string.uuid(),
    number: faker.number.int({ min: 1, max: 100 }),
    dateIssued: faker.date.recent(),
    dateDue: faker.date.future(),
    settled: faker.datatype.boolean({ probability: 0.65 }),
    recipient: customer,
    patron: company,
    items,
  };
};
