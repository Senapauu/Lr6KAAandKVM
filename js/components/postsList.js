const PostsList = {
    render(posts, searchQuery = '', onAdd, onRemove) {
        const container = DOMUtils.createElement('div', { className: 'posts-container' });

        if (onAdd) {
            const addBtn = DOMUtils.createElement('button', {
                className: 'btn btn--primary add-post-btn',
                onClick: () => {
                    const title = prompt('Заголовок поста:');
                    if (title) {
                        const body = prompt('Текст поста:');
                        if (body) onAdd({ title, body });
                    }
                }
            }, '+ Новый пост');
            container.appendChild(addBtn);
        }

        const listContainer = DOMUtils.createElement('div', { className: 'posts-list' });
        const filteredPosts = this.filterPosts(posts, searchQuery);

        if (filteredPosts.length === 0) {
            const emptyMessage = DOMUtils.createElement('p', {
                className: 'empty-message'
            }, 'Посты не найдены');
            listContainer.appendChild(emptyMessage);
        } else {
            const grid = DOMUtils.createElement('div', { className: 'posts-grid' });
            filteredPosts.forEach(post => {
                grid.appendChild(this.createPostCard(post, onRemove));
            });
            listContainer.appendChild(grid);
        }

        container.appendChild(listContainer);
        return container;
    },

    createPostCard(post, onRemove) {
        const card = DOMUtils.createElement('div', { className: 'post-card' });

        if (onRemove) {
            const delBtn = DOMUtils.createElement('button', {
                className: 'post-card__delete',
                onClick: (e) => {
                    e.stopPropagation();
                    if (confirm('Удалить пост?')) onRemove(post.id);
                }
            }, '×');
            card.appendChild(delBtn);
        }

        const title = DOMUtils.createElement('h3', { className: 'post-card__title' }, post.title);
        const body = DOMUtils.createElement('p', { className: 'post-card__body' }, post.body);

        card.appendChild(title);
        card.appendChild(body);

        const footer = DOMUtils.createElement('div', { className: 'post-card__footer' });
        const commentsLink = DOMUtils.createElement('button', {
            className: 'btn btn--small',
            onClick: () => Router.navigate(`users#posts#comments?postId=${post.id}`)
        }, 'Комментарии');

        footer.appendChild(commentsLink);
        card.appendChild(footer);

        return card;
    },

    filterPosts(posts, query) {
        if (!query) return posts;
        const lowerQuery = query.toLowerCase();
        return posts.filter(post =>
            post.title.toLowerCase().includes(lowerQuery) ||
            post.body.toLowerCase().includes(lowerQuery)
        );
    }
};
