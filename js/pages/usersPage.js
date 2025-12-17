const UsersPage = {
    async render() {
        const app = document.getElementById('app');
        DOMUtils.clearElement(app);

        const pageHeader = DOMUtils.createElement('div', { className: 'page-header' });
        const breadcrumbs = Breadcrumbs.render(NavigationConfig.getBreadcrumbs('users'));
        const title = DOMUtils.createElement('h1', { className: 'page-title' }, 'Пользователи');
        const addUserBtn = DOMUtils.createElement('button', {
            className: 'btn btn--primary',
            onClick: () => AddUserModal.render((userData) => {
                StorageUtils.addCustomUser(userData);
                this.render();
            })
        }, '+ Добавить пользователя');

        pageHeader.appendChild(breadcrumbs);
        pageHeader.appendChild(title);
        pageHeader.appendChild(addUserBtn);
        app.appendChild(pageHeader);

        const loader = DOMUtils.createElement('div', { className: 'loader' });
        app.appendChild(loader);

        try {
            const apiUsers = await API.fetchUsers();
            const allUsers = StorageUtils.mergeWithApiUsers(apiUsers);
            app.removeChild(loader);

            const searchContainer = DOMUtils.createElement('div', { className: 'search-container' });
            const searchComponent = Search.render((query) => {
                const filteredList = UsersList.render(allUsers, query, (id) => this.handleDelete(id));
                const oldList = document.querySelector('.users-list');
                if (oldList) oldList.replaceWith(filteredList);
            });
            searchContainer.appendChild(searchComponent);
            app.appendChild(searchContainer);

            const usersList = UsersList.render(allUsers, '', (id) => this.handleDelete(id));
            app.appendChild(usersList);

        } catch (error) {
            if (app.contains(loader)) app.removeChild(loader);
            app.appendChild(DOMUtils.createElement('p', { className: 'error-message' }, 'Ошибка загрузки пользователей'));
        }
    },

    handleDelete(userId) {
        if (confirm('Удалить пользователя?')) {
            StorageUtils.deleteCustomUser(userId);
            this.render();
        }
    }
};
