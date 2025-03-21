export interface Dog {
  id: string;
  name: string;
  breed?: string;
  photoUrl?: string;
}

export interface ApiError {
  message: string;
  code: number;
}