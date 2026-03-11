export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roles: string[];
};

export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
};

export type PasswordRequest = {
  userId: string;
  newPassword: string;
};

export type Employee = {
  employeesId: number | null;
  legalName: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  status: string;
  title: string;
};

export type Equipment = {
  equipmentsId: number | null;
  family: string;
  number: string;
  name: string;
  manufacturing: string;
  model: string;
  year: string;
  purchaseDate: string;
  status: string;
  condition: string;
  serialNumber: string;
  hour: string;
};

export type Attachment = {
  attachmentsId: number | null;
  family: string;
  number: string;
  name: string;
  manufacturing: string;
  model: string;
  year: string;
  purchaseDate: string;
  status: string;
  condition: string;
  serialNumber: string;
};

export type Job = {
  jobsId: number | null;
  number: string;
  type: string;
  name: string;
  address: string;
  contractor: string;
  contact: string;
  status: string;
};
