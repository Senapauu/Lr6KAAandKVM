const TodosPage = {
    async render() {
        const app = document.getElementById('app');
        DOMUtils.clearElement(app);

        const pageHeader = DOMUtils.createElement('div', { className: 'page-header' });
        const breadcrumbs = Breadcrumbs.render(NavigationConfig.getBreadcrumbs('users#todos'));
        const title = DOMUtils.createElement('h1', { className: 'page-title' }, 'Задачи');

        pageHeader.appendChild(breadcrumbs);
        pageHeader.appendChild(title);
        app.appendChild(pageHeader);

        const loader = DOMUtils.createElement('div', { className: 'loader' });
        app.appendChild(loader);

        try {
            const hash = window.location.hash;
            const params = Router.parseRoute(hash).params;
            const userId = params.userId;

            if (!userId) {
                app.removeChild(loader);
                app.appendChild(DOMUtils.createElement('p', { className: 'error-message' }, 'Пользователь не найден'));
                return;
            }

            const isCustomUser = userId > 10000000000;
            const todos = await API.fetchTodos(userId);
            const customTodos = StorageUtils.getUserTodos(userId);
            const allTodos = [...customTodos, ...todos];
            app.removeChild(loader);

            const searchContainer = DOMUtils.createElement('div', { className: 'search-container' });
            const searchComponent = Search.render((query) => {
                const filteredList = TodosList.render(
                    allTodos,
                    query,
                    isCustomUser ? (todo) => this.handleAddTodo(userId, todo) : null,
                    (id) => this.handleToggleTodo(userId, id)
                );
                const oldList = document.querySelector('.todos-container');
                if (oldList) oldList.replaceWith(filteredList);
            });
            searchContainer.appendChild(searchComponent);
            app.appendChild(searchContainer);

            const todosList = TodosList.render(
                allTodos,
                '',
                isCustomUser ? (todo) => this.handleAddTodo(userId, todo) : null,
                (id) => this.handleToggleTodo(userId, id)
            );
            app.appendChild(todosList);

        } catch (error) {
            if (app.contains(loader)) app.removeChild(loader);
            app.appendChild(DOMUtils.createElement('p', { className: 'error-message' }, 'Ошибка загрузки задач'));
        }
    },

    handleAddTodo(userId, todoData) {
        StorageUtils.addUserTodo(userId, todoData);
        this.render();
    },

    handleToggleTodo(userId, todoId) {
        const customTodos = StorageUtils.getUserTodos(userId);
        const todo = customTodos.find(t => t.id === todoId);
        if (todo) {
            todo.completed = !todo.completed;
            localStorage.setItem(`todos_${userId}`, JSON.stringify(customTodos));
            this.render();
        }
    }
};
