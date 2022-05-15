import { FullColumn } from '../services/interfaces/columns';

export const filterByTasks = (
  columns: FullColumn[] | null,
  selectedTaskId: string,
  selectedColumnId: string
) => {
  const updatedColumns: FullColumn[] = [];
  columns?.forEach((column) => {
    if (column.id !== selectedColumnId) {
      updatedColumns.push(column);
    } else {
      const newColumn = { ...column };
      const updatedTasks = column.tasks.filter((task) => !task.id.includes(selectedTaskId));
      newColumn.tasks = updatedTasks;
      updatedColumns.push(newColumn);
    }
  });

  return updatedColumns;
};
