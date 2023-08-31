import fetch from "node-fetch";
import { createMocks } from "node-mocks-http";
import { DELETE, GET } from "./route";
import { Invoice } from "@/utils/data-helpers";

describe("Find Invoice Route", () => {
  describe("GET invoices", () => {
    const customerId = "5ac51f7e-81b1-49c6-9c39-78b2d171abd6";
    let invoices: Invoice[];
    const { req } = createMocks({
      method: "GET",
    });

    it("should return an array of invoices", async () => {
      const invoicesRequest = await GET(req, {
        params: { id: customerId },
      });
      const { data } = await invoicesRequest.json();
      expect(invoicesRequest.status).toEqual(200);
      expect(data).toBeDefined();
      invoices = data;
    });

    it("should have every invoice with invoiceTotal property defined", async () => {
      invoices.forEach((invoice) => expect(invoice.invoiceTotal).toBeDefined());
    });

    it("should have sorted invoices with ascending order", async () => {
      expect(
        invoices.every(
          (value, index, array) =>
            index === 0 || value.number >= array[index - 1].number
        )
      ).toBeTruthy();
    });

    it("should apply 10% discount to unsettled invoices with total value of more than 100", async () => {
      invoices.forEach((invoice) => {
        let invoiceTotal = invoice.items.reduce(
          (cmValue, current) => (cmValue += current.price * current.quantity),
          0
        );

        invoiceTotal = invoiceTotal / 100;

        if (!invoice.settled) {
          if (invoiceTotal >= 100) {
            expect(invoice.discount).toBeDefined();
            expect(invoice.discount).toBeGreaterThan(0);
          }
        }
      });
    });

    it("should fail if it cant find an invoices by customer id", async () => {
      const invoicesRequest = await GET(req, {
        params: { id: "not-a-valid-id" },
      });
      expect(invoicesRequest.status).toEqual(404);
    });
  });

  describe("Delete invoice", () => {
    const { req } = createMocks({
      method: "DELETE",
    });

    it("should return status 200 after API call", async () => {
      const deleteInvoice = await DELETE(req, { params: { id: "invoice-id" } });
      expect(deleteInvoice.status).toEqual(200);
    });
  });
});
