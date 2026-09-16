import { CourseCard } from '@/components/courses/CourseCard';
import { CourseFilters } from '@/components/courses/CourseFilters';
import { Pagination } from '@/components/courses/Pagination';
import { SiteHeader } from '@/components/layouts/SiteHeader';
import { getApiClient } from '@/lib/api/client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Course Catalogue | StockLearn',
  description: 'Browse our complete catalog of stock market courses.',
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const pageSize = typeof searchParams.pageSize === 'string' ? parseInt(searchParams.pageSize, 10) : 12;
  const format = typeof searchParams.format === 'string' ? searchParams.format : undefined;
  const level = typeof searchParams.level === 'string' ? searchParams.level : undefined;
  const language = typeof searchParams.language === 'string' ? searchParams.language : undefined;
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;

  const client = await getApiClient();

  const { data, error } = await client.GET('/courses', {
    params: {
      query: {
        page,
        pageSize,
        format: format as undefined,
        level: level as undefined,
        language,
        q,
      },
    },
    cache: 'no-store', // Always fetch fresh data from the backend
  });

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center bg-red-900/20 border border-red-500/30 p-8 rounded-lg max-w-lg w-full">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error loading courses</h2>
          <p className="text-foreground/80">We could not load the course catalogue at this time. Please try again later.</p>
        </div>
      </div>
    );
  }

  const courses = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen bg-background text-slate-200">
      <SiteHeader />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 mb-4">
            Explore Courses
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl">
            Master the stock market with our expert-led courses. From basics to advanced strategies, find the perfect path for your financial journey.
          </p>
        </div>

        {/* Filters */}
        <CourseFilters />

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Pagination */}
            {meta && (
              <Pagination 
                currentPage={meta.page || page} 
                pageSize={meta.pageSize || pageSize} 
                total={meta.total || 0} 
              />
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-surface/30 border border-border/50 rounded-lg">
            <h3 className="text-xl font-semibold text-foreground/80 mb-2">No courses found</h3>
            <p className="text-foreground/40">Try adjusting your filters or search query to find what you&apos;re looking for.</p>
          </div>
        )}
      </main>
    </div>
  );
}
