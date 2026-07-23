export type ServiceId = 
  | "exterior" 
  | "interior" 
  | "paint_correction" 
  | "ceramic" 
  | "engine_bay" 
  | "other";

export interface ServiceOption {
  id: ServiceId;
  name: string;
  tagline: string;
  description: string;
  startingPrice: number;
  duration: string;
  iconName: string;
  popular?: boolean;
  badge?: string;
}

export interface ServiceStageOption {
  id: string;
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
  recommended?: boolean;
  features: string[];
}

export interface AddOnOption {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  iconName: string;
  badge?: string;
}

export interface VehicleDetails {
  make: string;
  model: string;
  year: string;
  color: string;
  sizeCategory: "coupe" | "sedan" | "suv" | "exotic";
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
}

export interface BookingState {
  step: number;
  selectedServiceId: ServiceId | null;
  selectedSubOptionId: string | null;
  selectedAddOnIds: string[];
  vehicle: VehicleDetails;
  selectedDate: string | null;
  selectedTimeSlot: string | null;
  customer: CustomerDetails;
  customServiceNote: string;
}
