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
  };
}
