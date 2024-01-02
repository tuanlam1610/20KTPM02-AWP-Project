import { HolderOutlined, MinusOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Form, Input, InputNumber, Tooltip } from 'antd';
import { useController, useFormContext } from 'react-hook-form';
import { cn } from '../../utils/cn';

export const EditGradeItem = ({
  className,
  index,
  onRemove,
}: {
  className?: string;
  index: number;
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
      index,
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

  const { control, formState } = useFormContext();
  const { field: name } = useController({
    name: `grade[${index}].name`,
    control,
  });

  const { field: percentage } = useController({
    name: `grade[${index}].percentage`,
    control,
  });
  const { field } = useController({
    name: `grade[${index}]`,
    control,
  });

  return (
    <div
      key={index}
      className={`space-y-1 my-1 ${isDragging && 'opacity-50'}`}
      style={style}
      ref={setNodeRef}
    >
      <div className="flex gap-2 items-center">
        <HolderOutlined
          className={cn('cursor-grab', className)}
          {...listeners}
          {...attributes}
        />
        <Input
          disabled={field.value.isFinalized}
          className="w-2/3"
          placeholder="Name"
          onChange={name.onChange}
          value={name.value}
        />
        <InputNumber
          placeholder="Percentage"
          min={1}
          max={100}
          disabled={field.value.isFinalized}
          value={percentage.value}
          onChange={percentage.onChange}
        />

        {!field.value.id && (
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
