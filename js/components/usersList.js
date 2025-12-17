const UsersList = {
    render(users, searchQuery = '', onDelete) {
        const container = DOMUtils.createElement('div', { className: 'users-list' });
        const filteredUsers = this.filterUsers(users, searchQuery);

        if (filteredUsers.length === 0) {
            container.appendChild(DOMUtils.createElement('p', { className: 'empty-message' }, 'Пользователи не найдены'));
            return container;
        }

        filteredUsers.forEach(user => {
            const card = this.createUserCard(user, onDelete);
            container.appendChild(card);
        });

        return container;
    },

    createUserCard(user, onDelete) {
        const card = DOMUtils.createElement('div', { className: 'user-card' });

        const info = DOMUtils.createElement('div', { className: 'user-card__info' });
        info.appendChild(DOMUtils.createElement('h3', { className: 'user-card__name' }, user.name));
        info.appendChild(DOMUtils.createElement('p', { className: 'user-card__email' }, user.email));
        info.appendChild(DOMUtils.createElement('p', { className: 'user-card__company' }, user.company.name));

        const actions = DOMUtils.createElement('div', { className: 'user-card__actions' });

        const todosBtn = DOMUtils.createElement('button', {
            className: 'btn btn--small',
            onClick: () => Router.navigate(`users#todos?userId=${user.id}`)
        }, 'Задачи');

        const postsBtn = DOMUtils.createElement('button', {
            className: 'btn btn--small',
            onClick: () => Router.navigate(`users#posts?userId=${user.id}`)
        }, 'Посты');

        actions.appendChild(todosBtn);
        actions.appendChild(postsBtn);

        if (user.isCustom) {
            const deleteBtn = DOMUtils.createElement('button', {
                className: 'btn btn--danger btn--small',
                onClick: () => onDelete(user.id)
            }, 'Удалить');
            actions.appendChild(deleteBtn);
        }

        card.appendChild(info);
        card.appendChild(actions);

        return card;
    },

    filterUsers(users, query) {
        if (!query) return users;
        const lowerQuery = query.toLowerCase();
        return users.filter(user =>
            user.name.toLowerCase().includes(lowerQuery) ||
            user.email.toLowerCase().includes(lowerQuery)
        );
    }
};
