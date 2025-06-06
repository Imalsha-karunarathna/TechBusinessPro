export interface Solution {
  id: number;
  title: string;
  description: string;
  category: string;
  provider_id: number;
  regions: string[];
  image_url?: string;
  features?: string[]; // Make features optional
  pricing_info?: string;
  is_featured?: boolean;
  views_count?: number;
  inquiries_count?: number;
  created_at?: string;
  updated_at?: string;
  provider?: SolutionProvider; // Optional provider relation
}

export interface SolutionProvider {
  id: number;
  name: string;
  description: string;
  email: string;
  website?: string | null;
  phone?: string | null;
  logo_url?: string | null;
  regions_served?: string[] | null;
  verification_status: 'pending' | 'approved' | 'rejected';
  approved_date?: Date | null;
  created_at: Date;
  user_id: number;
  application_id?: number | null;
  // Added fields that come from joined data
  expertise?: string[];
  rating?: number;
  reviews?: number;
}

export interface SolutionWithProvider {
  solution: Solution;
  provider: SolutionProvider;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author_name: string;
  author_image: string;
  image_url: string;
  published_at: string;
  reading_time: number;
  created_at: string;
}

export interface PartnerApplication {
  id: number;
  partner_name: string;
  organization_name: string;
  email: string;
  phone?: string | null;
  website?: string | null;
  expertise: string[];
  designation: string;
  experience_years?: number | null;
  reason?: string | null;
  additional_notes?: string | null;
  application_status: 'pending' | 'approved' | 'rejected';
  reviewer_id?: number | null;
  review_notes?: string | null;
  reviewed_at?: Date | null;
  created_at: Date;
}

export interface ContactInquiry {
  name: string;
  email: string;
  phone?: string;
  inquiry_type: string;
  subject: string;
  message: string;
  solution_type?: string;
  preferred_contact?: string;
}
export interface ExpertiseRequest {
  id: number;
  name: string;
  created_at: string | Date;
  provider: {
    name: string;
    email: string;
  };
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  applicationExpertise: {
    id: string;
    name: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
  }[];
}
export interface ContactRequest {
  id?: number;
  provider_id: number;
  provider_name: string;
  seeker_id: number;
  seeker_name: string;
  seeker_email: string;
  requirements: string;
  preferred_date: string;
  preferred_time_slot: string;
  urgency: 'low' | 'medium' | 'high';
  phone?: string | null;
  company_name?: string | null;
  budget?: string | null;
  additional_info?: string | null;
  status: 'pending' | 'contacted' | 'completed' | 'rejected';
  notes?: string | null;
  read?: boolean;
  documents?: DocumentInfo | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface DocumentInfo {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
}

export type UserWithoutPassword = {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'solution_provider' | 'solution_seeker' | 'agent';
  avatar_url: string | null;
  organization_id: number | null;
  is_active: boolean;
  last_login: Date | null;
  created_at: Date;
};

export type AuthResult<T = UserWithoutPassword> = {
  success: boolean;
  user?: T;
  error?: string;
  message?: string;
};

export type LoginData = {
  username: string;
  password: string;
  isAdmin?: boolean;
};

export type RegisterData = {
  name: string;
  username: string;
  email: string;
  password: string;
  acceptPolicy: boolean;
};
