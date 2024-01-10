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
import { Button, Form, Modal, message } from 'antd';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { EditGradeItem } from '../Components/EditGradeItem';
import { EditGradeItemSkeleton } from '../Components/EditGradeItemSkeleton';
import GradeItem from '../Components/GradeItem';
import axios from 'axios';
import { getGradeComposition } from '../../redux/classDetailThunks';
import { debounce } from 'lodash';

export default function GradeStructure() {
  const [messageApi, contextHolder] = message.useMessage();
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
  const form = useForm({
    defaultValues: {
      grade: [
        {
          name: '',
          id: '',
          percentage: 0,
          isFinalized: false,
        },
      ],
    },
  });
  const { register, control, handleSubmit, reset, watch } = form;
  const { fields, append, remove, swap, move } = useFieldArray({
    control,
    name: 'grade',
  });

  const onSubmit = async (data) => {
    let totalGrade = 0;
    const body = data.grade.map((g, i) => {
      totalGrade += g.percentage;
      return { ...g, rank: i };
    });
    if (totalGrade !== 100) {
      messageApi.open({
        type: 'error',
        content: `Total percentage must be 100%`,
        duration: 3,
      });
      return;
    }
    const result = await axios.patch(
      `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/classes/${classId}/updateGradeCompositionOrder`,
      body,
    );
    dispatch(getGradeComposition({ id: classId }));
    reset();
    setIsEditing(false);
  };

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

    setActiveId(active.id);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;

    if (!active || !over) return;
    if (active && over) {
      if (active.id !== over.id) {
      }
    }
  };

  const handleDragEnd = (event: any) => {
    // update db
    const { active, over } = event;

    move(active.id, over.id);
    setActiveId(null);
  };

  const onFinishFailed = (error: any) => {};

  const handleClick = debounce(() => {
    if (isEditing) {
      reset();
      setIsEditing(false);
    } else {
      remove(0);
      for (const grade of Object.values(gradeCompositionMap)) {
        const data = {
          id: grade.id,
          name: grade.name,
          percentage: grade.percentage,
          isFinalized: grade.isFinalized,
        };
        append(data);
      }
      setIsEditing(true);
    }
  }, 50);

  return (
    <FormProvider {...form}>
      {contextHolder}

      <Form onFinish={handleSubmit(onSubmit)} onFinishFailed={onFinishFailed}>
        <div>
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-lg font-semibold">Grade Structure:</h1>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    className="w-24"
                    icon={<CloseOutlined />}
                    onClick={handleClick}
                    danger
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-20 !hover:bg-[#1677FF]"
                    icon={<SaveOutlined />}
                    htmlType="submit"
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="flex justify-center items-center h-8 px-8 bg-indigo-500 text-white"
                    onClick={() => {
                      navigate(`grademanagement`);
                    }}
                  >
                    Manage Grade
                  </Button>
                  <Button
                    className="w-20 !hover:bg-[#1677FF]"
                    icon={<EditOutlined />}
                    onClick={handleClick}
                  >
                    Edit
                  </Button>
                </>
              )}
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
                        key={item.id}
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
                        id: '',
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
                {gradeCompositionIds.map((id) => (
                  <GradeItem key={id} id={id} />
                ))}
              </>
            )}
          </div>
        </div>
      </Form>
    </FormProvider>
  );
}
