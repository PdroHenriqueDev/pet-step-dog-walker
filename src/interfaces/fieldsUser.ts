export interface FieldsUser {
  id: string;
  label: string;
  value?: string | null;
  hide?: boolean;
  fieldType?:
    | 'name'
    | 'lastName'
    | 'birthdate'
    | 'phone'
    | 'address'
    | 'document'
    | 'bank'
    | 'email';
  displayNmae?: string;
}
