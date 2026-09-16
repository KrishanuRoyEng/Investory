'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Lock, PlayCircle, Clock } from 'lucide-react';
import { components } from '@/lib/api/v1';

type CourseModule = components['schemas']['CourseModule'];

interface CurriculumAccordionProps {
  modules: CourseModule[];
}

export function CurriculumAccordion({ modules }: CurriculumAccordionProps) {
  // Open the first module by default
  const [openModuleIds, setOpenModuleIds] = useState<Set<string>>(
    new Set(modules.length > 0 ? [modules[0].id!] : [])
  );

  const toggleModule = (id: string) => {
    setOpenModuleIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!modules || modules.length === 0) {
    return (
      <div className="text-foreground/60 p-4 border border-border rounded-md bg-surface/30">
        Curriculum for this course is being prepared.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((mod, index) => {
        const isOpen = openModuleIds.has(mod.id!);
        const lessons = mod.lessons || [];
        const totalDuration = lessons.reduce((acc, l) => acc + (l.durationSec || 0), 0);

        return (
          <div key={mod.id} className="border border-border rounded-md overflow-hidden bg-surface/30">
            <button
              onClick={() => toggleModule(mod.id!)}
              className="w-full flex items-center justify-between p-5 bg-surface hover:bg-surface/80 transition-colors text-left"
            >
              <div>
                <h4 className="text-lg font-semibold text-slate-200">
                  <span className="text-foreground/40 mr-2">Module {index + 1}:</span>
                  {mod.title}
                </h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-foreground/40">
                  <span>{lessons.length} lessons</span>
                  {totalDuration > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.round(totalDuration / 60)} min
                    </span>
                  )}
                </div>
              </div>
              <div className="text-foreground/60">
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {isOpen && (
              <div className="divide-y divide-slate-800/50">
                {lessons.map((lesson, lIndex) => {
                  const isRedacted = lesson.videoUrl === undefined || lesson.videoUrl === null;

                  return (
                    <div key={lesson.id} className="p-4 pl-6 flex items-center justify-between group hover:bg-surface/80/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-8 flex justify-center text-slate-600 font-medium">
                          {lIndex + 1}
                        </div>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isRedacted ? 'bg-surface/80 text-foreground/40' : 'bg-primary/20 text-primary'}`}>
                          {isRedacted ? <Lock className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        </div>
                        <span className={`font-medium ${isRedacted ? 'text-foreground/80' : 'text-slate-100 group-hover:text-primary'}`}>
                          {lesson.title}
                        </span>
                      </div>
                      
                      {lesson.durationSec != null && (
                        <div className="text-sm text-foreground/40">
                          {formatDuration(lesson.durationSec)}
                        </div>
                      )}
                    </div>
                  );
                })}
                {lessons.length === 0 && (
                  <div className="p-4 text-center text-foreground/40 text-sm">
                    No lessons in this module yet.
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
