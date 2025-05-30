
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockCourses, moduleTypeIcons } from '@/data/mockCourses';
import type { CourseModule } from '@/types/course';
import { ExternalLink, FlaskConical, Loader2, ScanSearch } from 'lucide-react';

interface ArLabItem extends CourseModule {
  courseName: string;
  courseId: string;
  courseCategory?: string;
}

export default function LabsPage() {
  const [arLabs, setArLabs] = useState<ArLabItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const labs: ArLabItem[] = [];
    mockCourses.forEach(course => {
      course.modules.forEach(module => {
        if (module.type === 'ar_interactive_lab') {
          labs.push({
            ...module,
            courseName: course.name,
            courseId: course.id,
            courseCategory: course.category,
          });
        }
      });
    });
    setArLabs(labs);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const ArLabIcon = moduleTypeIcons['ar_interactive_lab'] || ScanSearch;


  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl flex items-center">
          <FlaskConical className="mr-3 h-8 w-8" /> Interactive AR Labs
        </h1>
        <p className="text-muted-foreground mt-2">
          Engage with cutting-edge Augmented Reality labs for a hands-on learning experience.
        </p>
      </div>

      {arLabs.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg py-10">No AR interactive labs available at the moment. Please check back later.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {arLabs.map((lab) => {
            const placeholderImageIndex = parseInt(lab.id.replace(/\D/g,''), 10) % 4 + 9; // cycle through random=9,10,11,12

            return (
              <Card key={lab.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                 <div className="relative h-48 w-full">
                  <Image
                    src={`https://picsum.photos/seed/${lab.id}/400/200`}
                    alt={lab.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    data-ai-hint={`augmented reality ${lab.courseCategory || 'science'}`}
                  />
                   <div className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full">
                     <ArLabIcon className="h-5 w-5" />
                   </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{lab.title}</CardTitle>
                   <CardDescription>
                    Part of: <Link href={`/courses/${lab.courseId}`} className="text-accent hover:underline">{lab.courseName}</Link>
                  </CardDescription>
                   {lab.courseCategory && <Badge variant="secondary" className="mt-1">{lab.courseCategory}</Badge>}
                </CardHeader>
                <CardContent className="flex-grow">
                 <p className="text-sm text-muted-foreground">
                    Estimated duration: {lab.estimatedDuration || 'N/A'}. Dive into an immersive AR experience.
                 </p>
                </CardContent>
                <CardFooter>
                  {lab.url ? (
                    <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      <a href={lab.url} target="_blank" rel="noopener noreferrer">
                        Launch AR Lab <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button className="w-full" disabled>Lab Link Unavailable</Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
