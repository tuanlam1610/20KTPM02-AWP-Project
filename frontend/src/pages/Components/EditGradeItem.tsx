import { useSortable } from '@dnd-kit/sortable';
import { useAppSelector } from '../../redux/store';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../utils/cn';
import { HolderOutlined, MinusOutlined } from '@ant-design/icons';
import { Button, Input, InputNumber, Tooltip } from 'antd';

export const EditGradeItem = ({
  className,
  index,
  data,
  onRemove,
}: {
  className?: string;
  index: number;
  data: {
    name: string;
    percentage: number;
    gradeId: string;
    isFinalized: boolean;
  };
  onRemove: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({
    id: index,
    data: {
      ...data,
    },
    transition: {
      duration: 350, // milliseconds
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      key={data.gradeId}
      className={`space-y-1 my-1 ${isDragging && 'opacity-50'}`}
      style={style}
      ref={setNodeRef}
      //   onMouseOver={() => setIsHovering(true)}
      //   onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex gap-2 items-center">
        <HolderOutlined
          className={cn('cursor-grab', className)}
          {...listeners}
          {...attributes}
        />
        <Input
          disabled={data.isFinalized}
          className="w-2/3"
          placeholder="Name"
          value={data.name}
        />
        <InputNumber
          placeholder="Percentage"
          min={1}
          max={100}
          value={data.percentage}
          disabled={data.isFinalized}
        />
        {!data.gradeId && (
          <Tooltip title="Remove">
            <Button
              shape="circle"
              size="small"
              icon={<MinusOutlined />}
              danger
              onClick={onRemove}
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
};
