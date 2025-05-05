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
  website?: string;
  phone?: string;
  logo_url?: string;
  regions_served?: string[];
  verification_status: 'pending' | 'approved' | 'rejected';
  approved_date?: string;
  created_at: string;
  rating?: number; // Added for UI display
  reviews?: number; // Added for UI display
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
  partner_name: string;
  organization_name: string;
  email: string;
  phone?: string;
  website?: string;
  expertise: string;
  collaboration: string;
  experience_years?: number;
  reason?: string;
  additional_notes?: string;
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
