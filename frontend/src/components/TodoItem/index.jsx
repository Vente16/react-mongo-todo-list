const TodoItem = ({
  id,
  name,
  isDone,
  disableButtons = false,
  onDoneClick,
  onDeleteItem,
}) => {
  const handleDoneItem = () => {
    if (onDoneClick) onDoneClick(id, name, isDone);
  };

  const handleDeleteItem = () => {
    if (onDeleteItem) onDeleteItem(id);
  };

  const itemDoneTextCLass = isDone ? 'line-through' : '';

  return (
    <div className="flex mb-4 items-center">
      <p className={`w-full ${itemDoneTextCLass} text-grey-darkest`}>{name}</p>
      <button
        disabled={disableButtons}
        className="p-2 ml-4 mr-2 border-2 rounded hover:text-white text-green-500 border-green-500 hover:bg-green-500"
        onClick={handleDoneItem}
      >
        {isDone ? 'Undone' : 'Done'}
      </button>
      <button
        disabled={disableButtons}
        className="flex-no-shrink p-2 ml-2 border-2 rounded border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
        onClick={handleDeleteItem}
      >
        Remove
      </button>
    </div>
  );
};

export default TodoItem;
