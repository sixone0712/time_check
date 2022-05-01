export interface ResSignIn {
  authorized: boolean;
  department: string;
  id: string;
  name: string;
  redmineKey: string;
}

export interface ReqSignUp {
  id: string;
  redmineKey: string;
}

export interface ResSignUp {
  id: string;
  name: string;
  redmineId: string;
  department: string;
  redmineKey: string;
}
