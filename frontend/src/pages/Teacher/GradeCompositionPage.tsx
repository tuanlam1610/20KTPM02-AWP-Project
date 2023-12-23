import React from 'react';
import { useParams } from 'react-router-dom';

export default function GradeCompositionPage() {
  const params = useParams();
  console.log(params);
  return <div>GradeCompositionPage</div>;
}
