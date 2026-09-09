'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import { Award, CheckCircle, ShieldAlert } from 'lucide-react';

interface GradeItem {
  id: string;
  submissionId: string;
  score: number;
  privateFeedback?: string;
  released: boolean;
  gradedAt: string;
}

export default function GradebookPage() {
  const { classroomId } = useParams<{ classroomId: string }>();

  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (classroomId) {
      loadGradebook();
    }
  }, [classroomId]);

  const loadGradebook = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch<GradeItem[]>(`/classrooms/${classroomId}/gradebook`);
      setGrades(data || []);
    } catch (err: any) {
      setError(err.message || 'Only instructors or TAs have permission to inspect the full gradebook.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto p-8 bg-[#313338]">
      {/* Header */}
      <div className="pb-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Award className="w-7 h-7 text-amber-400" />
          Course Gradebook
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Review evaluated student submissions, score distributions, and private feedback.
        </p>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading grade records...</div>
        ) : error ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center max-w-md mx-auto">
            <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white mb-1">Student View Active</h3>
            <p className="text-xs text-gray-300">
              {error} You can check your individual scores directly inside each assignment page.
            </p>
          </div>
        ) : grades.length === 0 ? (
          <div className="text-center py-20 bg-[#2b2d31]/50 rounded-2xl border border-gray-800 p-8 max-w-lg mx-auto">
            <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">No grades recorded yet</h3>
            <p className="text-sm text-gray-400 mt-1">
              Once student submissions are graded, they will appear here in the gradebook.
            </p>
          </div>
        ) : (
          <div className="bg-[#2b2d31] rounded-2xl border border-gray-800 overflow-hidden shadow-xl max-w-5xl">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#1e1f22] text-xs uppercase font-semibold text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4">Submission Reference</th>
                  <th className="py-3 px-4">Awarded Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Feedback</th>
                  <th className="py-3 px-4">Date Graded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {grades.map((gr) => (
                  <tr key={gr.id} className="hover:bg-[#35373c] transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-brand-400">
                      {gr.submissionId.slice(0, 8)}...
                    </td>
                    <td className="py-3 px-4 font-bold text-white text-base">
                      {gr.score}
                    </td>
                    <td className="py-3 px-4">
                      {gr.released ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Released
                        </span>
                      ) : (
                        <span className="text-xs text-amber-400 font-medium">Draft</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400 max-w-xs truncate">
                      {gr.privateFeedback || '—'}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {new Date(gr.gradedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
