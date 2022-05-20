import { SyntheticEvent, useState } from 'react';
import { useForm } from 'react-hook-form';

import s from './Task.module.scss';
import g from './../../../../App.module.scss';
import type { FullTask } from '../../../../services/interfaces/tasks';
import { DeleteTaskButton } from '../DeleteTaskButton/DeleteTaskButton';
import { Modal } from '../../../../components/Modal/Modal';
import { useAppDispatch } from '../../../../Redux/reduxHooks';
import { getUserId } from '../../../../services/utils';
import { updateTask } from '../../../../services/tasks';
import { fetchBoard } from '../../../../Redux/actionCreators/fetchBoard';

type Props = {
  task: FullTask;
  boardId: string | undefined;
  columnId: string | undefined;
};

export type TaskData = {
  title: string;
  description: string;
};

export const Task = (props: Props) => {
  const dispatch = useAppDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleCloseModal = () => setModalIsOpen(false);
  const handleOpenModal = (e: SyntheticEvent) => {
    const target = e.currentTarget;
    console.log(target.tagName === 'BUTTON');
    setModalIsOpen(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskData>();

  const handleEditTask = async (data: TaskData) => {
    const userId = await getUserId();
    const { boardId, columnId } = props;
    const { title, description } = data;

    if (boardId && columnId && userId) {
      const updateResponse = await updateTask(boardId, columnId, {
        ...props.task,
        title,
        description,
      });
      handleCloseModal();

      if (updateResponse.hasOwnProperty('statusCode')) alert('Error');
      else {
        reset({
          title: '',
          description: '',
        });
        dispatch(fetchBoard(boardId));
      }
    }
  };

  const createContent = () => {
    return (
      <>
        <label className={g.label}>
          <p>title:</p>
          <input
            {...register('title', { required: true, minLength: 3, maxLength: 16 })}
            className={g.input}
            type="text"
            defaultValue={props.task.title}
            placeholder="name task"
          />

          {errors.title && (
            <span className={g.font_error}>
              {errors.title.type === 'required' && 'Title is required'}
              {errors.title.type === 'minLength' && 'Title must be at least 3 characters'}
              {errors.title.type === 'maxLength' && 'Title must be at most 16 characters'}
            </span>
          )}
        </label>

        <label className={s.label}>
          <p>description:</p>
          <textarea
            {...register('description', { required: true, minLength: 3, maxLength: 144 })}
            className={`${g.input} ${s.textarea}`}
            // type="area"
            defaultValue={props.task.description}
            placeholder="description task"
          ></textarea>

          {errors.description && (
            <span className={g.font_error}>
              {errors.description.type === 'required' && 'Description is required'}
              {errors.description.type === 'minLength' &&
                'Description must be at least 3 characters'}
              {errors.description.type === 'maxLength' &&
                'Description must be at most 144 characters'}
            </span>
          )}
        </label>
      </>
    );
  };

  return (
    <>
      <div onClick={handleOpenModal} className={s.task}>
        <div className={s.content}>
          <p className={s.title}>{props.task.title}</p>
          <p className={s.description}>{props.task.description}</p>
        </div>

        <DeleteTaskButton columnId={props.columnId} taskId={props.task.id} />
      </div>

      <Modal
        title="Change task"
        content={createContent()}
        onConfirm={handleSubmit(handleEditTask)}
        onClose={handleCloseModal}
        open={modalIsOpen}
      />
    </>
  );
};
