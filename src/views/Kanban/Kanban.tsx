import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import s from './Kanban.module.scss';
import { Spinner } from '../../components/Spinner/Spinner';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks';
import {
  boardSlice,
  fetchBoardThunk,
  setBoard,
  setCurrentBoardId,
} from '../../Redux/slices/boardSlice';
import { Column } from './components/Column/Column';
import { CreateColumnButton } from './components/CreateColumnButton/CreateColumnButton';
import type { FullBoard } from '../../services/interfaces/boards';
import {
  reorderColumns,
  reorderTasks,
  syncColumnOrderToServer,
  syncTaskOrderWithServer,
  syncTasksWithRedux,
  syncTasksWithReduxBetweenColumns,
} from './utils';
import { updateColumnTask } from '../../services/tasks';
import { showError } from '../../components/ToasterMessage/ToasterMessage';
import { ColumnError } from '../../services/interfaces/columns';
import { UpdateError } from '../../services/interfaces/tasks';

export const Kanban = () => {
  const navigate = useNavigate();
  const paramId = useParams().id;

  const dispatch = useAppDispatch();
  const boards = useAppSelector((state) => state.boards.boardsArray);
  const board = useAppSelector((state) => state.board.board);
  const columns = board?.columns.slice();

  const { currentBoardId, isBoardLoaded } = useAppSelector((state) => state.board);
  const { setColumns } = boardSlice.actions;

  useEffect(() => {
    if (!paramId) return;

    const isTrueBoardId = boards?.map((item) => item.id).includes(paramId);
    if (!isTrueBoardId) navigate('/');

    if (paramId !== currentBoardId) {
      dispatch(setCurrentBoardId(paramId));
      dispatch(fetchBoardThunk(paramId));
    } else document.title = `${board && board.title} | KanbanBoar`;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId, board]);

  const handleDragEnd = async (result: DropResult) => {
    // https://codesandbox.io/s/nested-dnd-across-parent-forked-bhvm51?file=/index.js:1415-1426
    const { source, destination, type } = result;
    if (!destination || !columns || !board) return;

    const fromIndex = source.index;
    const toIndex = destination.index;

    const fromParentId = source.droppableId;
    const toParentId = destination.droppableId;

    if (type === 'column') {
      if (fromIndex === toIndex || !currentBoardId) return;

      const newOrders = reorderColumns(columns, fromIndex, toIndex);
      dispatch(setColumns(newOrders));

      const draggedColumn = columns[fromIndex];

      // syncWithServer
      const columnResponse = await syncColumnOrderToServer(
        currentBoardId,
        draggedColumn,
        toIndex + 1
      );
      if (!columnResponse.hasOwnProperty('id')) showError((columnResponse as ColumnError).message);
    }

    if (type === 'task') {
      const fromColumnId = fromParentId;
      const toColumnId = toParentId;
      const currentColumn = columns.find((column) => column.id === fromColumnId);
      const tasks = currentColumn?.tasks.slice();

      if (fromParentId === toColumnId) {
        if (!tasks || !currentColumn || !currentBoardId) return;

        const reorderedTasks = reorderTasks(tasks, fromIndex, toIndex);
        const newBoard = syncTasksWithRedux(board, currentColumn, reorderedTasks);
        dispatch(setBoard(newBoard as FullBoard));

        const draggedTask = tasks[fromIndex];

        // syncWithServer
        const response = await syncTaskOrderWithServer(
          draggedTask,
          currentBoardId,
          currentColumn.id,
          toIndex + 1
        );
        if (!response.hasOwnProperty('id')) showError((response as UpdateError).message);
      }

      if (fromParentId !== toColumnId) {
        const toColumn = columns.find((column) => column.id === toColumnId);
        if (!currentColumn || !toColumn || !tasks || !currentBoardId) return;

        const fromTasks = [...tasks];
        const toTasks = [...toColumn?.tasks];

        const [draggedTask] = fromTasks.splice(fromIndex, 1);
        toTasks.splice(toIndex, 0, draggedTask);

        const newColumns = syncTasksWithReduxBetweenColumns(
          columns,
          fromTasks,
          toTasks,
          fromColumnId,
          toColumnId
        );

        dispatch(setColumns(newColumns));

        // syncWithServer
        const response = await updateColumnTask(currentBoardId, currentColumn.id, toColumn.id, {
          ...draggedTask,
          order: toIndex + 1,
        });
        if (!response.hasOwnProperty('id')) showError((response as UpdateError).message);
      }
    }
  };

  return (
    <>
      {isBoardLoaded ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="board" type="column" direction="horizontal">
            {(provided) => (
              <div className={s.content} {...provided.droppableProps} ref={provided.innerRef}>
                {columns?.map((column, index) => (
                  <Draggable key={column.id} draggableId={column.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Column key={column.id} columnId={column.id} column={column} />
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}

                {currentBoardId && <CreateColumnButton boardId={currentBoardId} />}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <Spinner />
      )}
    </>
  );
};
