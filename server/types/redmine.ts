export interface MyAccount {
  user: {
    id: number;
    login: string;
    admin: boolean;
    firstname: string;
    lastname: string;
    mail: string;
    created_on: string;
    last_login_on: string;
    api_key: string;
  };
}

export interface Project {
  id: number;
  name: string;
}

export interface Issue {
  id: number;
}

export interface User {
  id: number;
  name: string;
}

export interface Activity {
  id: number;
  name: string;
}

export interface CustomField {
  id: number;
  name: string;
  value: string;
}

export interface TimeEntry {
  id: number;
  project: Project;
  issue: Issue;
  user: User;
  activity: Activity;
  hours: number;
  comments: string;
  spent_on: string;
  created_on: Date;
  updated_on: Date;
  custom_fields: CustomField[];
}

export interface RedmineTimeEntry {
  time_entries: TimeEntry[];
  total_count: number;
  offset: number;
  limit: number;
}
