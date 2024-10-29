import {Address} from './address';

export interface WalkDetails {
  owner: {
    _id: string;
    name: string;
    rate: number;
  };
  dogWalker: {
    _id: string;
    name: string;
    rate: number;
  };
  walk: {
    durationMinutes: number;
    finalCost: number;
    numberOfDogs: number;
    receivedLocation: Address;
    serviceFee: number;
    totalCost: string;
    dogs: Dog[];
  };
}

export interface WalkInProgressProps {
  dogWalker?: {
    _id?: string;
    name?: string;
    rate?: number;
  };
  owner?: {
    _id?: string;
    name?: string;
    rate?: number;
  };
  durationMinutes?: number;
}

export interface Dog {
  breed: string;
  size: string;
}
