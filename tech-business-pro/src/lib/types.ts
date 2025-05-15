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
