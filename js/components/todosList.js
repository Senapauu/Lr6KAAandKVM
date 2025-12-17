const TodosList = {
    render(todos, searchQuery = '', onAdd, onToggle) {
        const container = DOMUtils.createElement('div', { className: 'todos-container' });

        if (onAdd) {
            const addBtn = DOMUtils.createElement('button', {
                className: 'btn btn--primary add-todo-btn',
                onClick: () => {
                    const title = prompt('Введите название задачи:');
                    if (title) onAdd({ title });
                }
            }, '+ Новая задача');
            container.appendChild(addBtn);
        }

        const listContainer = DOMUtils.createElement('div', { className: 'todos-list' });
        const filteredTodos = this.filterTodos(todos, searchQuery);

        if (filteredTodos.length === 0) {
            listContainer.appendChild(DOMUtils.createElement('p', { className: 'empty-message' }, 'Задачи не найдены'));
        } else {
            filteredTodos.forEach(todo => {
                listContainer.appendChild(this.createTodoItem(todo, onToggle));
            });
        }

        container.appendChild(listContainer);
        return container;
    },

    createTodoItem(todo, onToggle) {
        const item = DOMUtils.createElement('div', {
            className: `todo-item ${todo.completed ? 'todo-item--completed' : ''}`,
            onClick: () => onToggle(todo.id)
        });

        const checkbox = DOMUtils.createElement('div', { className: 'todo-item__checkbox' });
        const title = DOMUtils.createElement('span', { className: 'todo-item__title' }, todo.title);

        item.appendChild(checkbox);
        item.appendChild(title);

        return item;
    },

    filterTodos(todos, query) {
        if (!query) return todos;
        return todos.filter(todo =>
            todo.title.toLowerCase().includes(query.toLowerCase())
        );
    }
};
