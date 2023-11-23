export interface User {
  id: string;
  name: string;
  email: string;
  height: { feet: number; inches: number };
  weight: number;
  dob: Date;
  photoURL: string;
}

export type Gender = "male" | "female";
