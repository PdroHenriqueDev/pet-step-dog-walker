export const truncateText = ({
  text,
  maxLength,
}: {
  text: string;
  maxLength: number;
}) => {
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength - 3)}...`;
  }
  return text;
};

export const formatPhoneNumber = (phone?: string) => {
  if (!phone) return '';
  return phone
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d{2})(\d)/g, '+$1 ($2) $3')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

export const formatCPF = (cpf?: string) => {
  if (!cpf) return '';
  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const removeMask = (value?: string) => {
  if (!value) return '';
  return value.replace(/\D/g, '');
};

export const removePhoneMask = (phone?: string) => {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
};

export const formatCEP = (cep: string) => {
  return cep
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

export const isAdult = (birthdate: string | number | Date) => {
  const today = new Date();
  const birthDate = new Date(birthdate);

  const adultMinimumDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  );

  return birthDate <= adultMinimumDate;
};

export const formatDate = (date?: string | number | Date) => {
  if (!date) return '';
  const newDate = new Date(date);
  return newDate.toLocaleDateString('pt-BR');
};
