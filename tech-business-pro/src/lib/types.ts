export interface Solution {
  id: number;
  title: string;
  description: string;
  category: string;
  provider_id: number;
  regions: string[];
  image_url: string;
  created_at: string;
}

export interface SolutionProvider {
  id: number;
  name: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  created_at: string;
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
