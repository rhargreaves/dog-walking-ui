export interface Dog {
  id: string;
  name: string;
  breed?: string;
  dateOfBirth?: string;
  energyLevel: number;
  isNeutered?: boolean;
  sex: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  socialization?: {
    goodWithChildren?: boolean;
    goodWithLargeDogs?: boolean;
    goodWithPuppies?: boolean;
    goodWithSmallDogs?: boolean;
  };
  specialInstructions?: string;
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