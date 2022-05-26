import { updateColumn } from '../../../services/columns';
import { FullColumn } from '../../../services/interfaces/columns';

export const syncColumnsOrderWithServer = async (columns: FullColumn[], boardId: string) => {
  const syncColumnOrderToServer = async (column: FullColumn, order = column.order) =>
    await updateColumn(boardId, column.id, column.title, order);

  const makeColumnsOrderIsUnique = columns.map((item, index) => ({
    ...item,
    order: index + 100,
  }));
  const uniqueOrder = makeColumnsOrderIsUnique.map((column) => syncColumnOrderToServer(column));
  await Promise.all(uniqueOrder);

  const newColumnsOrder = columns.map((column) => syncColumnOrderToServer(column));
  await Promise.all(newColumnsOrder);
};
