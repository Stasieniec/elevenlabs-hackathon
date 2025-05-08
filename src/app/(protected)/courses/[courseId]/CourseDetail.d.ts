import { Course } from '../../../lib/courses';

export interface CourseDetailProps {
  course: Course;
}

declare const CourseDetail: React.FC<CourseDetailProps>;
export default CourseDetail; 