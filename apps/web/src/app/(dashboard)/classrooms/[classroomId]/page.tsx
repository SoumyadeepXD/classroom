'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ClassroomEntryPage() {
  const { classroomId } = useParams<{ classroomId: string }>();
  const router = useRouter();

  useEffect(() => {
    if (classroomId) {
      router.replace(`/classrooms/${classroomId}/stream`);
    }
  }, [classroomId, router]);

  return null;
}
