export interface Dog {
  id: string;
  name: string;
  breed?: string;
  photoUrl?: string;
  photoHash?: string;
}

export interface DogList {
  dogs: Dog[];
  nextToken?: string;
}

export interface ApiError {
  code: number;
  message: string;
}

export interface ApiErrorResponse {
  error: ApiError;
}