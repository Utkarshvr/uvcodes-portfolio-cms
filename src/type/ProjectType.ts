export type PROJECT_TYPE_INTERFACE = "app" | "website" | "landing-page" | "ai";

export default interface ProjectType {
  id?: string;
  title: string;
  description?: string;
  type?: PROJECT_TYPE_INTERFACE;
  source_code: string;
  visit_link: string;
  isPublished?: boolean;

  icon?: string;
  images?: string[];
  tools?: string[];
}
