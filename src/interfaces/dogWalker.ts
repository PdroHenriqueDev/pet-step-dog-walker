export interface DogWalker {
  _id?: string;
  name?: string;
  email?: string;
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
  date?: string;
  time?: string;
  profileUrl?: string;
}

export interface DogWalkerForm {
  name: string;
  email: string;
  cpf: string;
  zipCode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  password: string;
  confirmPassword: string;
}
