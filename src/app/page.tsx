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
  const [discount, setDiscount] = useState(0);

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

  useEffect(() => {
    getCustomer();
    getInvoices();
  }, [userId]);

  const getTotal = (items: LineItem[], discount: number = 0) => {
    let total = items.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.price * currentItem.quantity;
    }, 0);
    if (discount > 0) {
      console.log(discount);
      let discountAmount = (total * discount) / 100;
      total = total - discountAmount;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total/100);

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
            <Table fontSize="sm" variant="striped" colorScheme="gray">
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
                        <Td>{dateDue.toString()}</Td>
                        <Td>{dateIssued.toString()}</Td>
                        <Td color={ discount && discount > 0 ? "green" : ""} >{getTotal(items, discount)}</Td>
                      </Tr>
                    )
                  )}
              </Tbody>
            </Table>
          </TableContainer>
        </GeneralBox>
        <GeneralBox>
          <Table fontSize="sm">
            <Tbody>
              <Tr>
                <Td>
                  <strong>Discount:</strong>
                </Td>
                <Td textAlign="right">???</Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Invoice Total:</strong>
                </Td>
                <Td textAlign="right">???</Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Total Paid:</strong>
                </Td>
                <Td textAlign="right">???</Td>
              </Tr>
              <Tr>
                <Td border="none">
                  <strong>Total Owed:</strong>
                </Td>
                <Td border="none" textAlign="right">
                  ???
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </GeneralBox>
      </PageWrapper>
    </>
  );
}
