import { HolderOutlined } from '@ant-design/icons';
import { Input, InputNumber, Skeleton } from 'antd';
import { cn } from '../../utils/cn';

export const EditGradeItemSkeleton = ({
  className,
  data,
}: {
  className?: string;
  data: { name: string; percentage: number; id: string };
}) => {
  return (
    <div className={`space-y-1 `}>
      <div className="flex gap-2 items-center">
        <HolderOutlined className={cn('cursor-grab', className)} />
        <Input className="w-2/3" placeholder="Name" value={data.name} />
        <InputNumber
          placeholder="Percentage"
          min={1}
          max={100}
          value={data.percentage}
        />
      </div>
    </div>
  );
};
