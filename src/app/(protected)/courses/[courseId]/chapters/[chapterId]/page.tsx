'use client';

import React from 'react';

export default function ChapterDetailPage({ params }: { params: { courseId: string, chapterId: string } }) {
  return (
    <div>
      <h1>Chapter Detail Page</h1>
      <p>Course ID: {params.courseId}</p>
      <p>Chapter ID: {params.chapterId}</p>
      {/* TODO: Fetch and display chapter details and situations */}
    </div>
  );
} 