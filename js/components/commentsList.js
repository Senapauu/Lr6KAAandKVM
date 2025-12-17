const CommentsList = {
    render(comments, searchQuery = '', onAdd, onRemove, defaultEmail = '') {
        const container = DOMUtils.createElement('div', { className: 'comments-container' });

        if (onAdd) {
            const addBtn = DOMUtils.createElement('button', {
                className: 'btn btn--primary add-comment-btn',
                onClick: () => {
                    const name = prompt('Ваше имя:');
                    if (name) {
                        const email = prompt('Ваш Email:', defaultEmail);
                        if (email) {
                            const body = prompt('Текст комментария:');
                            if (body) onAdd({ name, email, body });
                        }
                    }
                }
            }, '+ Добавить комментарий');
            container.appendChild(addBtn);
        }

        const listContainer = DOMUtils.createElement('div', { className: 'comments-list' });
        const filteredComments = this.filterComments(comments, searchQuery);

        if (filteredComments.length === 0) {
            listContainer.appendChild(DOMUtils.createElement('p', { className: 'empty-message' }, 'Комментарии не найдены'));
        } else {
            filteredComments.forEach(comment => {
                listContainer.appendChild(this.createCommentItem(comment, onRemove));
            });
        }

        container.appendChild(listContainer);
        return container;
    },

    createCommentItem(comment, onRemove) {
        const item = DOMUtils.createElement('div', { className: 'comment-item' });

        if (onRemove) {
            const delBtn = DOMUtils.createElement('button', {
                className: 'comment-item__delete',
                onClick: () => {
                    if (confirm('Удалить комментарий?')) onRemove(comment.id);
                }
            }, '×');
            item.appendChild(delBtn);
        }

        const header = DOMUtils.createElement('div', { className: 'comment-item__header' });
        const name = DOMUtils.createElement('h4', { className: 'comment-item__name' }, comment.name);
        const email = DOMUtils.createElement('span', { className: 'comment-item__email' }, comment.email);

        header.appendChild(name);
        header.appendChild(email);

        const body = DOMUtils.createElement('p', { className: 'comment-item__body' }, comment.body);

        item.appendChild(header);
        item.appendChild(body);

        return item;
    },

    filterComments(comments, query) {
        if (!query) return comments;
        const lowerQuery = query.toLowerCase();
        return comments.filter(comment =>
            comment.name.toLowerCase().includes(lowerQuery) ||
            comment.body.toLowerCase().includes(lowerQuery)
        );
    }
};
