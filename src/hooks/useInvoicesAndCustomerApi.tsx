import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import apiInstance from "../utils/axios-config";
import { Customer, Invoice } from "@/utils/data-helpers";

export default function useInvoicesAndCustomerApi(): {
  invoices: Invoice[];
  customer: Customer;
  isLoading: boolean;
  isError: boolean;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  resetData: () => void;
} {
  const [userId, setUserId] = useState("5ac51f7e-81b1-49c6-9c39-78b2d171abd6");
  const queryClient = useQueryClient();

  const {
    data: invoices,
    isLoading: isLoadingInvoices,
    isError: isInvoiceError,
  } = useQuery(["invoices", userId], () =>
    apiInstance(`/invoices/${userId}`, {
      method: "GET",
    }).then((res) => res.data?.data)
  );

  const {
    data: customer,
    isLoading: isLoadingCustomers,
    isError: isCustomerError,
  } = useQuery(["customer", userId], () =>
    apiInstance(`/findCustomer/${userId}`, {
      method: "GET",
    }).then((res) => res.data?.data)
  );

  const resetData = () => queryClient.invalidateQueries();

  return {
    invoices,
    customer,
    isLoading: isLoadingInvoices || isLoadingCustomers,
    isError: isInvoiceError || isCustomerError,
    setUserId,
    resetData,
  };
}
