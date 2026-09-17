'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';

export default function ClassroomChannelsRedirect() {
  const { classroomId } = useParams<{ classroomId: string }>();
  const router = useRouter();

  useEffect(() => {
    if (classroomId) {
      apiFetch<Array<{ id: string }>>(`/classrooms/${classroomId}/channels`)
        .then((channels) => {
          if (channels && channels.length > 0) {
            router.replace(`/classrooms/${classroomId}/channels/${channels[0].id}`);
          } else {
            router.replace(`/classrooms/${classroomId}/stream`);
          }
        })
        .catch(() => {
          router.replace(`/classrooms/${classroomId}/stream`);
        });
    }
  }, [classroomId, router]);

  return (
    <div className="h-full flex items-center justify-center bg-[#313338] text-gray-400">
      <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full mr-3" />
      <span>Loading channels...</span>
    </div>
  );
}
