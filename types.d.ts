export interface AuthCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  userId: number;
};

export type Project = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  client: Client;
  clientId: number;
  userId: number;
  status: string;
};

export type Invoice = {
  id: number;
  amount: number;
  currency: string;
  paymentLink: string;
  dueDate: string;
  status: string;
  clientId: number;
  userId: number;
  project: Project;
};

export type ColumnDef<T> = {
  columnName: string;
  key: keyof T | string[]; // Allow both keyof T and string[]
  isSortable?: boolean;
  sortFn?: () => void;
};
