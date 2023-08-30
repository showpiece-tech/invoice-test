"use client";
import { useState, useEffect } from "react";
import {
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { PageWrapper } from "./components/pageWrapper";
import { GeneralBox } from "./components/generalBox";
import { Customer, Invoice, LineItem } from "@/utils/data-helpers";

export default function Home() {
  const [userId, setUserId] = useState("5ac51f7e-81b1-49c6-9c39-78b2d171abd6");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [customerTotal, setCustomerTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalOwed, setTotalOwed] = useState(0);

  useEffect(() => {
    getCustomer();
    getInvoices();
  }, [userId]);

  useEffect(() => {
    if (invoices) {
      const { total, totalDiscount, totalPaid, totalOwed } =
        getCustomerTotal(invoices);
      setCustomerTotal(total);
      setTotalDiscount(totalDiscount);
      setTotalPaid(totalPaid);
      setTotalOwed(totalOwed);
    }
  }, [invoices]);

  const getCustomer = async () => {
    try {
      const response = await fetch(`/api/findCustomer/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data } = await response.json();
      setCustomer(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getInvoices = async () => {
    try {
      const response = await fetch(`/api/invoices/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data } = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCustomerTotal = (invoices: Invoice[]) => {
    let total = 0;
    let totalDiscount = 0;
    let totalPaid = 0;
    let totalOwed = 0;

    invoices.forEach(({ items, discount = 0, settled }) => {
      let amount = items.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.price * currentItem.quantity;
      }, 0);
      if (discount > 0) {
        const discountAmount = (amount * discount) / 100;
        amount -= discountAmount;
        totalDiscount += discountAmount / 100;
      }
      total += amount / 100;
      settled ? (totalPaid += amount/100) : (totalOwed += amount/100);
    });
    return { total, totalDiscount, totalPaid, totalOwed };
  };

  const getInvoiceAmount = (items: LineItem[], discount: number = 0) => {
    let total = items.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.price * currentItem.quantity;
    }, 0);
    if (discount > 0) {
      let discountAmount = (total * discount) / 100;
      total = total - discountAmount;
    }
    return formatCurrency(total / 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    const myDate = new Date(date);
    const newDate = new Intl.DateTimeFormat("en-US").format(myDate);
    return newDate;
  };

  return (
    <>
      <PageWrapper>
        <GeneralBox>
          <Heading as="h2" size="lg">
            Invoices
          </Heading>
          <Text>
            Displaying invoices for <strong>{customer?.name}</strong>
          </Text>
        </GeneralBox>

        <GeneralBox>
          <TableContainer>
            <Table fontSize="sm" variant="striped">
              <Thead>
                <Tr>
                  <Th>Invoice #</Th>
                  <Th>Date Due</Th>
                  <Th>Date Sent</Th>
                  <Th>Amount</Th>
                  <Td></Td>
                </Tr>
              </Thead>
              <Tbody>
                {invoices &&
                  invoices.map(
                    ({
                      number,
                      id,
                      dateDue,
                      dateIssued,
                      items,
                      settled,
                      discount,
                    }) => (
                      <Tr key={id} color={!settled ? "red" : ""}>
                        <Td>{number}</Td>
                        <Td>{formatDate(dateDue)}</Td>
                        <Td>{formatDate(dateIssued)}</Td>
                        <Td color={discount && discount > 0 ? "green" : ""}>
                          {getInvoiceAmount(items, discount)}
                        </Td>
                      </Tr>
                    )
                  )}
              </Tbody>
            </Table>
          </TableContainer>
        </GeneralBox>
        <GeneralBox>
          <Table fontSize="sm"  variant="striped">
            <Tbody>
              <Tr>
                <Td>
                  <strong>Discount:</strong>
                </Td>
                <Td textAlign="right">{formatCurrency(totalDiscount)}</Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Invoice Total:</strong>
                </Td>
                <Td textAlign="right">{formatCurrency(customerTotal)}</Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Total Paid:</strong>
                </Td>
                <Td textAlign="right">{formatCurrency(totalPaid)}</Td>
              </Tr>
              <Tr>
                <Td border="none">
                  <strong>Total Owed:</strong>
                </Td>
                <Td border="none" textAlign="right">
                  {formatCurrency(totalOwed)}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </GeneralBox>
      </PageWrapper>
    </>
  );
}
