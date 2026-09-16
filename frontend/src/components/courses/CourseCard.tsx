import Link from 'next/link';
import { components } from '@/lib/api/v1';

type Course = components['schemas']['Course'];

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  // Format price from paise
  const priceFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(course.pricePaise / 100);

  // Gradient placeholder colors based on the first letter of the title
  const gradientPresets = [
    'from-emerald-500 to-teal-700',
    'from-blue-500 to-indigo-700',
    'from-purple-500 to-fuchsia-700',
    'from-rose-500 to-pink-700',
    'from-amber-500 to-orange-700',
  ];
  const charCode = course.title.charCodeAt(0) || 0;
  const gradientClass = gradientPresets[charCode % gradientPresets.length];

  return (
    <Link href={`/courses/${course.slug}`} className="group block h-full">
      <article className="flex flex-col h-full bg-surface/40 backdrop-blur-sm border border-border/60 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/20 hover:border-border/80">
        
        {/* Thumbnail Section */}
        <div className="relative w-full aspect-video bg-surface/80 overflow-hidden">
          {course.thumbnailUrl ? (
            <img 
              src={course.thumbnailUrl} 
              alt={course.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradientClass} transition-transform duration-500 group-hover:scale-105`}>
              <span className="text-4xl font-bold text-foreground/50">{course.title.charAt(0).toUpperCase()}</span>
            </div>
          )}
          
          {/* Format Badge over image */}
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-background/80 text-primary backdrop-blur-md border border-emerald-500/30 shadow-lg">
              {course.format.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-grow p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 text-xs font-medium rounded bg-surface/80 text-foreground/80">
              {course.level}
            </span>
            <span className="px-2 py-0.5 text-xs font-medium rounded bg-surface/80 text-foreground/80">
              {course.language}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-slate-100 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          
          <p className="text-sm text-foreground/60 line-clamp-2 mb-4 flex-grow">
            {course.description}
          </p>
          
          <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
            <span className="text-xl font-bold text-slate-100">
              {priceFormatted}
            </span>
            <span className="text-sm font-medium text-primary group-hover:text-primary transition-colors">
              View Course →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
