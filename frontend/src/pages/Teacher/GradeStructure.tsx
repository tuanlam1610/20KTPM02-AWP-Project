import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { EditGradeItem } from '../Components/EditGradeItem';
import { EditGradeItemSkeleton } from '../Components/EditGradeItemSkeleton';
import GradeItem from '../Components/GradeItem';

export default function GradeStructure() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const gradeCompositionMap = useAppSelector(
    (state) => state.class.gradeCompositionMap,
  );

  const params = useParams();
  const classId: string = params.id ? params.id : '';

  const gradeCompositionIds = Object.keys(gradeCompositionMap).sort(
    (a, b) => gradeCompositionMap[a].rank - gradeCompositionMap[b].rank,
  );
  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      grade: [
        {
          name: '',
          gradeId: '',
          percentage: 0,
          isFinalized: false,
        },
      ],
    },
  });
  const { fields, append, remove, swap, move } = useFieldArray({
    control,
    name: 'grade',
  });

  const onSubmit = (data) => console.log('data', data);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 20,
      },
    }),
  );

  const [activeId, setActiveId] = useState(null);

  const handleDragStart = (event: any) => {
    const { active } = event;
    console.log(active.id);
    setActiveId(active.id);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    console.log({ active, over });
    if (!active || !over) return;
    if (active && over) {
      if (active.id !== over.id) {
      }
    }
  };

  const handleDragEnd = (event: any) => {
    // update db
    const { active, over } = event;
    console.log({ active, over });
    move(active.id, over.id);
    setActiveId(null);
  };

  const handleClick = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      remove(0);
      for (const grade of Object.values(gradeCompositionMap)) {
        const data = {
          gradeId: grade.id,
          name: grade.name,
          percentage: grade.percentage,
          isFinalized: grade.isFinalized,
        };
        append(data);
      }
      setIsEditing(true);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Grade Structure:</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <Button
              className="w-24"
              icon={<CloseOutlined />}
              onClick={handleClick}
              danger
            >
              Cancel
            </Button>
          ) : (
            <Button
              className="flex justify-center items-center px-8 py-4 mb-2 bg-indigo-500 text-white"
              onClick={() => {
                navigate(`grademanagement`);
              }}
            >
              Manage Grade
            </Button>
          )}
          <Button
            className="w-20 !hover:bg-[#1677FF]"
            icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
            onClick={handleClick}
          >
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 max-h-[650px] overflow-auto">
        {isEditing ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex flex-col gap-1">
              <SortableContext
                items={gradeCompositionIds}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((item, index) => (
                  <EditGradeItem
                    className="cursor-grab"
                    index={index}
                    key={index}
                    data={item}
                    onRemove={() => {
                      remove(index);
                    }}
                  />
                ))}
              </SortableContext>
              {createPortal(
                <DragOverlay>
                  {activeId ? (
                    <EditGradeItemSkeleton data={fields[activeId]} />
                  ) : null}
                </DragOverlay>,
                document.body,
              )}
              <Button
                className="w-1/3"
                shape="round"
                icon={<PlusOutlined />}
                onClick={() => {
                  append({
                    name: '',
                    gradeId: '',
                    percentage: 0,
                    isFinalized: false,
                  });
                }}
              >
                Add New Grade
              </Button>
            </div>
          </DndContext>
        ) : (
          <>
            {Object.keys(gradeCompositionMap).map((id) => (
              <GradeItem key={id} id={id} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
