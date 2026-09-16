import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CourseFilters } from './CourseFilters';
import { CurriculumAccordion } from './CurriculumAccordion';
import { CourseActionCard } from './CourseActionCard';
import { useAuthStore } from '@/lib/store/auth.store';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(''),
  usePathname: () => '/courses/test-course',
}));

// Mock React Query
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useQuery: () => ({ data: [], isLoading: false }),
  };
});

describe('Course Catalogue Components', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    useAuthStore.setState({ status: 'idle', user: null, accessToken: null });
  });

  describe('CourseFilters', () => {
    it('pushes state to URL on form submission', () => {
      render(<CourseFilters />);
      
      const searchInput = screen.getByPlaceholderText('Search by title or topic...');
      fireEvent.change(searchInput, { target: { value: 'react' } });
      
      // submit form by clicking search
      const button = screen.getByText('Search');
      fireEvent.click(button);
      
      expect(mockPush).toHaveBeenCalledWith('?q=react');
    });
    
    it('pushes state to URL on select change', () => {
      render(<CourseFilters />);
      
      const select = screen.getByLabelText('Filter by level');
      fireEvent.change(select, { target: { value: 'BEGINNER' } });
      
      expect(mockPush).toHaveBeenCalledWith('?level=BEGINNER');
    });
  });

  describe('CurriculumAccordion', () => {
    it('renders Lock icon when videoUrl is missing, and PlayCircle when present', () => {
      const mockModules = [
        {
          id: 'mod1',
          courseId: 'c1',
          title: 'Module 1',
          order: 1,
          lessons: [
            {
              id: 'l1',
              moduleId: 'mod1',
              title: 'Locked Lesson',
              order: 1,
              // videoUrl is undefined
            },
            {
              id: 'l2',
              moduleId: 'mod1',
              title: 'Unlocked Lesson',
              order: 2,
              videoUrl: 'https://example.com/video.mp4',
            }
          ]
        }
      ];

      // We need to render the lock and play icons. We can mock lucide-react if needed,
      // but actually we can just check the DOM. The Lock icon has class lucide-lock.
      // But it's easier to check by looking at the parent element's class.
      const { container } = render(<CurriculumAccordion modules={mockModules} />);
      
      // The first module is open by default.
      
      const lockedLesson = screen.getByText('Locked Lesson');
      const unlockedLesson = screen.getByText('Unlocked Lesson');

      // The icon parent for locked lesson should have 'bg-surface/80 text-foreground/40'
      // The icon parent for unlocked lesson should have 'bg-primary/20 text-primary'
      
      expect(lockedLesson.previousElementSibling?.className).toContain('bg-surface/80 text-foreground/40');
      expect(unlockedLesson.previousElementSibling?.className).toContain('bg-primary/20 text-primary');
    });
  });

  describe('CourseActionCard', () => {
    it('constructs correct checkout URL when authenticated but not enrolled', () => {
      useAuthStore.setState({ status: 'authenticated' });
      
      render(<CourseActionCard courseId="course-123" pricePaise={100000} />);
      
      const button = screen.getByText('Enroll Now');
      fireEvent.click(button);
      
      expect(mockPush).toHaveBeenCalledWith('/checkout?courseId=course-123');
    });
    
    it('redirects to login when unauthenticated', () => {
      useAuthStore.setState({ status: 'unauthenticated' });
      
      render(<CourseActionCard courseId="course-123" pricePaise={100000} />);
      
      const button = screen.getByText('Enroll Now');
      fireEvent.click(button);
      
      expect(mockPush).toHaveBeenCalledWith('/login?redirect=/courses/test-course');
    });
  });
});
