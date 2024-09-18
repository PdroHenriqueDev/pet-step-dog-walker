export interface DogWalker {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  document?: string;
  address: {
    zipCode?: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  password?: string;
  confirmPassword?: string;
  rate?: number;
  distance?: string;
  isOnline?: boolean;
  status: string;
  date?: string;
  time?: string;
  profileUrl?: string;
}

export interface DogWalkerForm {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  zipCode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  password: string;
  confirmPassword: string;
}
