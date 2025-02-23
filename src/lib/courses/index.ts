import { Course } from '../types/courses';
import { breakingTaboosCourse } from './breakingTaboos';
import { Briefcase, Heart, Users } from 'lucide-react';

const professionalBoundariesCourse: Course = {
  id: "professional-boundaries",
  title: "Professional Boundaries: Setting Limits at Work",
  description: "Learn to establish and maintain healthy boundaries in the workplace. From saying no to unreasonable requests to managing work-life balance and handling workplace relationships.",
  category: "professional",
  categoryColor: "#3498DB",
  icon: Briefcase,
  isEnrollable: false,
  chapters: []
};

const relationshipsCourse: Course = {
  id: "difficult-relationships",
  title: "Navigating Difficult Relationships",
  description: "Master the art of handling complex family dynamics, toxic relationships, and setting boundaries with loved ones. Learn to have tough conversations while preserving important relationships.",
  category: "personal",
  categoryColor: "#E74C3C",
  icon: Heart,
  isEnrollable: false,
  chapters: []
};

const diversityCourse: Course = {
  id: "diversity-inclusion",
  title: "Diversity & Inclusion Conversations",
  description: "Develop skills for discussing diversity, equity, and inclusion. Learn to navigate sensitive topics, challenge biases respectfully, and foster inclusive environments.",
  category: "professional",
  categoryColor: "#F1C40F",
  icon: Users,
  isEnrollable: false,
  chapters: []
};

export const courses: Course[] = [
  breakingTaboosCourse,
  professionalBoundariesCourse,
  relationshipsCourse,
  diversityCourse
];

export * from './breakingTaboos';
export * from '../types/courses'; 