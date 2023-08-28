import apiInstance from "../utils/axios-config";
import { Customer, Invoice } from "@/utils/data-helpers";
import { useEffect, useState } from "react";

export default function useInvoicesAndCustomerApi() {
  const [userId, setUserId] = useState("5ac51f7e-81b1-49c6-9c39-78b2d171abd6");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const getInvoices = async () => {
      return apiInstance(`/invoices/${userId}`, {
        method: "GET",
      });
    };

    const getCustomer = async () => {
      return apiInstance(`/findCustomer/${userId}`, {
        method: "GET",
      });
    };

    setIsLoading(true);
    Promise.all([getInvoices(), getCustomer()])
      .then((res) => {
        console.log(res);
        setInvoices(res[0].data.data);
        setCustomer(res[1].data.data);
      })
      .catch((err) => {
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const deleteInvoice = async (invoiceId: string) => {
    apiInstance(`/invoices/${userId}/${invoiceId}`, {
      method: "DELETE",
    }).then(() => {
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== invoiceId));
    });
  };

  return {
    invoices,
    customer,
    isLoading,
    isError,
    deleteInvoice,
  };
}
