export interface ISchoolOwner {
  Id?: string;
  CeoName: string;
  Email: string;
  IsVerifiedEmail: boolean;
  PhoneNumber: number;
  IsVerifiedPhone: boolean;
  Password: string;
  SchoolName: string;
  Logo: string;
  Street: string;
  City: string;
  State: string;
  Country: string;
  CacRegNumber: string;
  EstablishedDate: Date;
  NumberOfTeachers: number;
  SchoolType: string[];
  Motto: string;
  Rank: string;
  Role: string;
}
