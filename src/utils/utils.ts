import type { Job } from "../types";

export const getNextJobNumber = (jobs: Job[] | undefined): string => {
  if (!jobs || jobs.length === 0) return "1";
  const max = Math.max(
    ...jobs.map((job) => {
      const parsed = parseFloat(job.number);
      return isNaN(parsed) ? 0 : parsed;
    })
  );
  return (max + 1).toString();
};


interface PasswordOptions {
  length?: number;
  includeUppercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
}

export const generatePassword = ({
  length = 12,
  includeUppercase = true,
  includeNumbers = true,
  includeSymbols = true
}: PasswordOptions = {}): string => {
  
  // Definición de los sets de caracteres
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  let charPool = lowercase;
  if (includeUppercase) charPool += uppercase;
  if (includeNumbers) charPool += numbers;
  if (includeSymbols) charPool += symbols;

  let password = "";
  
  // Usamos un bucle para seleccionar caracteres aleatorios del pool
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charPool.length);
    password += charPool.charAt(randomIndex);
  }

  return password;
};