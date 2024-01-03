import { useAppSelector } from '../../redux/store';
import GradeItem from './components/GradeItem';

export default function GradeStructure() {
  const gradeCompositionMap = useAppSelector(
    (state) => state.class.gradeCompositionMap,
  );

  const gradeCompositionIds = Object.keys(gradeCompositionMap).sort(
    (a, b) => gradeCompositionMap[a].rank - gradeCompositionMap[b].rank,
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-semibold">Grade Structure:</h1>
      </div>

      <div className="flex flex-col gap-4 max-h-[650px] overflow-auto">
        {gradeCompositionIds.map((id) => (
          <GradeItem key={id} id={id} />
        ))}
      </div>
    </div>
  );
}
