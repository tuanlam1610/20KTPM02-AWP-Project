import { useAppSelector } from '../../../redux/store';

export default function GradeItem({ id }: { id: string }) {
  const grade = useAppSelector((state) => state.class.gradeCompositionMap[id]);

  return (
    <div key={grade.id} className="flex gap-2 items-center">
      <div
        className={`flex justify-between items-center w-2/3 border bg-slate-100 pl-4 pr-2 py-2 rounded-md`}
      >
        {grade.name}
        <div className="bg-white px-4 py-2 rounded mr-4">
          {grade.percentage}%
        </div>
      </div>
    </div>
  );
}
