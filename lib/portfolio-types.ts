export type SiteInfo = {
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  linkedinHandle: string;
  github: string;
  githubHandle: string;
  website: string;
  yearsExp: string;
};

export type NavLink = {
  id: string;
  label: string;
  href: string;
  order: number;
};

export type AboutStat = {
  id: string;
  val: string;
  label: string;
  order: number;
};

export type AboutHighlight = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  order: number;
};

export type AboutContent = {
  paragraphs: string[];
  stats: AboutStat[];
  tags: string[];
  highlights: AboutHighlight[];
};

export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  points: string[];
  order: number;
  visible: boolean;
};

export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  icon: string;
  featured: boolean;
  liveUrl: string;
  githubUrl: string;
  order: number;
  visible: boolean;
};

export type SkillCategory = {
  id: string;
  name: string;
  items: string[];
  order: number;
};

export type SkillLevel = {
  id: string;
  name: string;
  level: number;
  order: number;
};

export type PortfolioData = {
  site: SiteInfo;
  navLinks: NavLink[];
  about: AboutContent;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skillCategories: SkillCategory[];
  skillLevels: SkillLevel[];
};

export function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export function reindexOrder<T extends { order: number }>(items: T[]): T[] {
  return items.map((item, index) => ({ ...item, order: index }));
}

export function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
