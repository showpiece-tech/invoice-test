import { createMocks } from "node-mocks-http";
import { GET } from "./route";
import { Invoice } from "@/utils/data-helpers";

describe("Find Invoice Route", () => {
  describe("GET Invoice", () => {
    const customerId = "5ac51f7e-81b1-49c6-9c39-78b2d171abd6";
    const { req } = createMocks({
      method: "GET",
    });

    it("should return  invoices by customer id", async () => {
      const invoiceRequest = await GET(req, {
        params: { customerId: customerId },
      });
      const invoice = await invoiceRequest.json();
      expect(invoiceRequest.status).toEqual(200);
      invoice.data.forEach((invoice: Invoice) => {
        expect(invoice.recipient).toEqual(customerId);
      });
    });

    it("should fail if it cant find a invoice", async () => {
      const invoiceRequest = await GET(req, {
        params: { customerId: "not-a-valid-id" },
      });
      const invoice = await invoiceRequest.json();
      expect(invoiceRequest.status).toEqual(404);
      expect(invoice.data).toEqual([]);
    });

    it("should apply a 10% discount to all invoices with a sum of all items greater than 10000 ($100) that are not settled", async () => {
      const invoiceRequest = await GET(req, {
        params: { customerId: customerId },
      });
      const invoices = await invoiceRequest.json();
      const data: Invoice[] = invoices.data;
      data.forEach((invoice, index) => {
        if (invoice.settled) return;

        const sumOfAllItemsInCents = invoice.items.reduce((acc, item) => {
          return acc + item.price * item.quantity;
        }, 0);

        if (sumOfAllItemsInCents > 10000) {
          expect(invoice.discount).toEqual(0.1);
        }
      });
    });
  });
});
