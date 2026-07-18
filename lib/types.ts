export type Discipline = {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  sort_order: number;
};

export type ProjectImage = {
  id: string;
  storage_path: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  is_cover: boolean;
  sort_order: number;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  year_label: string | null;
  location: string | null;
  client: string | null;
  studio: string | null;
  team: string[];
  role: string | null;
  area_m2: number | null;
  budget_label: string | null;
  certifications: string[];
  awards: string | null;
  image_credits: string | null;
  featured: boolean;
  sort_order: number;
  seshna_disciplines: Discipline;
  seshna_project_images: ProjectImage[];
};

export type Profile = {
  id: string;
  full_name: string;
  title: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  instagram: string | null;
  instagram_studio: string | null;
  instagram_culinary: string | null;
  location: string | null;
  software: string[];
  portrait_path: string | null;
};

export type Experience = {
  id: string;
  period_label: string;
  role: string;
  organization: string;
  city: string | null;
  details: string[];
  sort_order: number;
};
