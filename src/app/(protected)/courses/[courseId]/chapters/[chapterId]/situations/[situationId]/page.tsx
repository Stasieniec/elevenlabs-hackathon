'use client';

import React from 'react';

export default function SituationPage({ params }: { params: { courseId: string, chapterId: string, situationId: string } }) {
  return (
    <div>
      <h1>Situation Page</h1>
      <p>Course ID: {params.courseId}</p>
      <p>Chapter ID: {params.chapterId}</p>
      <p>Situation ID: {params.situationId}</p>
      {/* TODO: Implement situation interaction */}
    </div>
  );
} 