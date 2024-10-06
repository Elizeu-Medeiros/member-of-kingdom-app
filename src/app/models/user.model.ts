export interface User {
  id?: number,
  uuid: string,
  name: string,
  email: string,
  password?: string,
  sexo?: 'm' | 'f',
  data_aniversario: string,
}


