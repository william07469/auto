export type ServiceId =
  | "exterior"
  | "interior"
  | "paint_correction"
  | "ceramic"
  | "full_detail";

export type PackageId = "basic" | "premium" | "ultimate";

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
  selectedServiceId: ServiceId | null;
  selectedPackageId: PackageId | null;
  questionAnswers: QuestionAnswer[];
  selectedAddOnIds: string[];
  selectedDate: string | null;
  selectedTimeSlot: string | null;
  customer: CustomerDetails;
}
