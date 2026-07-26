export type CategoryId =
  | "exterior"
  | "interior"
  | "full_detail"
  | "paint_correction"
  | "ceramic";

// Keep ServiceId as alias for CategoryId for backwards compat
export type ServiceId = CategoryId;

export type PackageId = "basic" | "deluxe" | "premium";

export type IndividualServiceId =
  | "innenraumreinigung"
  | "aussenreinigung"
  | "lackpolitur"
  | "keramikversiegelung"
  | "motorraumreinigung"
  | "glasreinigung"
  | "felgenreinigung"
  | "snow_foam_wash";

export type VehicleType = "sedan" | "suv" | "van" | "coupe" | "pickup";

// What kind of booking the customer chose
export type BookingMode = "package" | "individual";

export interface ServiceOption {
  id: ServiceId;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  badge?: string;
  popular?: boolean;
}

export interface PackageOption {
  id: PackageId;
  name: string;
  tagline: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  recommended?: boolean;
}

export interface IndividualService {
  id: IndividualServiceId;
  name: string;
  description: string;
  price: number;
  duration: string;
  iconName: string;
  badge?: string;
}

export interface VehicleOption {
  id: VehicleType;
  name: string;
  description: string;
  iconName: string;
  surcharge: number; // additional price for larger vehicles
}

export interface ServiceQuestion {
  id: string;
  question: string;
  iconName: string;
  options: {
    id: string;
    label: string;
    iconName: string;
  }[];
}

export interface QuestionAnswer {
  questionId: string;
  answerId: string;
}

export interface AddOnOption {
  id: string;
  name: string;
  description: string;
  price: number;
  iconName: string;
  badge?: string;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
}

export interface BookingState {
  step: number;
  // Step 1: category selection
  selectedServiceId: ServiceId | null;
  // Step 2: package OR individual service
  bookingMode: BookingMode | null;
  selectedPackageId: PackageId | null;
  selectedIndividualServiceId: IndividualServiceId | null;
  // Step 3: vehicle
  selectedVehicleId: VehicleType | null;
  // Step 4: add-ons
  selectedAddOnIds: string[];
  // Step 5: date & time
  selectedDate: string | null;
  selectedTimeSlot: string | null;
  // Step 6: customer
  customer: CustomerDetails;
  questionAnswers: QuestionAnswer[];
}
