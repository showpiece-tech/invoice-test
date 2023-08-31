import { Customer } from "@/utils/data-helpers";

export const fetchCustomer = async (
  userId: string
): Promise<Customer | undefined> => {
  try {
    const response = await fetch(`/api/customer/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};