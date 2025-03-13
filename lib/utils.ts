import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getClients() {
  try {
    const response = await axios.get("/api/clients");
    const data = response.data.clients;
    return data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return null;
  }
}

export async function getProjects() {
  try {
    const response = await axios.get("/api/projects");
    const data = response.data.projects;
    return data;
  } catch (err) {
    console.log(`Error fetching projects: ${err}`);
    return null;
  }
}

export async function getInvoices() {
  try {
    const response = await axios.get("/api/invoices");
    const data = response.data.invoices;
    return data;
  } catch (err) {
    console.log(`Error fetching projects: ${err}`);
    return null;
  }
}
