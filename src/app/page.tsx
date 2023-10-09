"use client";
import { useState, useEffect } from "react";
import { Flex, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { PageWrapper } from "./components/pageWrapper";
import { GeneralBox } from "./components/generalBox";
import DeletePopup from "./components/deletePopup";
import { Customer, Invoice } from "@/utils/data-helpers";
import { formatDate, formatPrice } from "../utils/date-helpers";
import { DeleteIcon } from '@chakra-ui/icons'; // Import the DeleteIcon from Chakra UI icons
import { Button, IconButton } from '@chakra-ui/react';

import "./styles/globals.css";

export default function Home() {
  const [userId, setUserId] = useState("5ac51f7e-81b1-49c6-9c39-78b2d171abd6");
  const [selectedId, setSelectedId] = useState<string >("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);

  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [totalInvoice, setTotalInvoice] = useState<number>(0);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [totalOwed, setTotalOwed] = useState<number>(0);

  const newInvoices: Invoice[] = [];
  const DISCOUNT_LIMIT: number = 10000; // in cents

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

   // Function to delete an invoice by ID and schedule its removal after 3 seconds
  const handleDelete = (id: string) => {
    setInvoices(prevInvoices => {
      // Ensure that prevInvoices is not null
      if (prevInvoices) {
        // Check if prevInvoices is not null
        return prevInvoices.map(invoice =>
          invoice.id === selectedId? { ...invoice, deleted: true } : invoice
        );
      }
      // If prevInvoices is null, return an empty array or handle it as needed
      return [];
    });
  
    // Schedule the removal of the invoice after 3 seconds
    setTimeout(() => {
      setInvoices(prevInvoices =>
        prevInvoices ? prevInvoices.filter(invoice => invoice.id !== selectedId) : []
      );
    }, 500); 
  };

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch("/api/invoices")
      .then((response) => response.json())
      .then((data) => {
        const invoices = data.data as Invoice[];
        let discountSum: number = 0;
        let paidSum: number = 0;
        let owedSum: number = 0;
        let invoiceSum: number = 0;
        for (let i = 0; i < invoices.length; i++) {
          let discount: number = 0;
          let invoice = invoices[i];
          let fullPrice: number = 0;
          invoice.items.forEach((item) => {
            const item_prices = item.price * item.quantity;
            fullPrice += item_prices;
          });
          if (fullPrice >= DISCOUNT_LIMIT && !invoice.settled) {
            discount = fullPrice * 0.1;
          }
          invoice.discount = discount;
          invoice.amount = fullPrice -discount;
          discountSum+=discount;

          if (invoice.settled){
            paidSum += invoice.amount; // paid items do not have discount
          } else{
            owedSum += invoice.amount;
          }

          invoiceSum += fullPrice;
          newInvoices.push(invoice)
        }

        setInvoices(newInvoices);
        setTotalDiscount(discountSum);
        setTotalInvoice(invoiceSum);
        setTotalOwed(owedSum);
        setTotalPaid(paidSum);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch(`/api/customers/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setCustomer(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Function to handle the delete button click
  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setIsDeletePopupOpen(true);
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
        <DeletePopup
          isOpen={isDeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)}
          onDelete={handleDelete}
          itemId={selectedId}
        />
        <GeneralBox overflowX="auto">
          <TableContainer>
            <Table fontSize="sm" >
              <Thead>
                <Tr>
                  <Th className="sticky-column" style={{background: "white"}}>Invoice #</Th>
                  <Th>Date Due</Th>
                  <Th>Date Sent</Th>
                  <Th>Amount</Th>
                  <Td></Td>
                </Tr>
              </Thead>
              <Tbody className="striped-table">
                {invoices &&
                  invoices.map(({ number, id, dateDue, dateIssued, settled, amount, discount, deleted }) => (
                    <Tr key={id}  className={deleted ? 'deleting' : ''}>
                      <Td className="sticky-column" style={{ color: !settled ? 'red' : 'inherit' }}> {number}</Td>
                      <Td style={{ color: !settled ? 'red' : 'inherit' }}>{formatDate(dateDue)}</Td>
                      <Td style={{ color: !settled ? 'red' : 'inherit' }}>{formatDate(dateIssued)}</Td>
                      <Td style={{ color: discount&&discount>0? 'green' : 'inherit' }}>{formatPrice(amount)}</Td>
                      <Td>  
                        {
                          settled?  <div>
                          <IconButton
                          className={deleted ? 'deleting' : ''}
                            key={id}
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            aria-label="Delete"
                            onClick={() => {handleDeleteClick(id)}}
                            borderRadius="full" // Make the button a circle
                            size="sm" // Adjust the size as needed
                          />
                        </div>:null
                        }
                       </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
        </GeneralBox>
        <GeneralBox float="right">
          <Table fontSize="sm" >
            <Tbody className="striped-table">
              <Tr>
                <Td>
                  <strong>Discount:</strong>
                </Td>
                <Td textAlign="right">{formatPrice(totalDiscount)}</Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Invoice Total:</strong>
                </Td>
                <Td textAlign="right">{formatPrice(totalInvoice)}</Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Total Paid:</strong>
                </Td>
                <Td textAlign="right">{formatPrice(totalPaid)}</Td>
              </Tr>
              <Tr>
                <Td border="none">
                  <strong>Total Owed:</strong>
                </Td>
                <Td border="none" textAlign="right">
                  {formatPrice(totalOwed)}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </GeneralBox>
      </PageWrapper>
    </>
  );
}
