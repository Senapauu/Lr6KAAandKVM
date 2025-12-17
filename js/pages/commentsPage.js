const CommentsPage = {
    async render() {
        const app = document.getElementById('app');
        DOMUtils.clearElement(app);

        const pageHeader = DOMUtils.createElement('div', { className: 'page-header' });
        const breadcrumbs = Breadcrumbs.render(NavigationConfig.getBreadcrumbs('users#posts#comments'));
        const title = DOMUtils.createElement('h1', { className: 'page-title' }, 'Комментарии');

        pageHeader.appendChild(breadcrumbs);
        pageHeader.appendChild(title);
        app.appendChild(pageHeader);

        const loader = DOMUtils.createElement('div', { className: 'loader' });
        app.appendChild(loader);

        try {
            const hash = window.location.hash;
            const params = Router.parseRoute(hash).params;
            const postId = params.postId;

            if (!postId) {
                app.removeChild(loader);
                app.appendChild(DOMUtils.createElement('p', { className: 'error-message' }, 'Пост не найден'));
                return;
            }

            let apiComments = [];
            let authorEmail = 'anon@example.com';

            try {
                let post;
                if (postId < 10000000000) {
                    apiComments = await API.fetchComments(postId);
                    const allApiPosts = await API.fetchPosts();
                    post = allApiPosts.find(p => p.id == postId);
                } else {
                    const customUsers = StorageUtils.getCustomUsers();
                    for (const user of customUsers) {
                        const userPosts = StorageUtils.getUserPosts(user.id);
                        const found = userPosts.find(p => p.id == postId);
                        if (found) {
                            post = found;
                            break;
                        }
                    }
                }

                if (post) {
                    const allUsers = await API.fetchUsers();
                    const mergedUsers = StorageUtils.mergeWithApiUsers(allUsers);
                    const user = mergedUsers.find(u => u.id == post.userId);
                    if (user) authorEmail = user.email;
                }
            } catch (e) { }

            const customComments = StorageUtils.getUserComments(postId);
            const deletedIds = StorageUtils.getDeletedComments();

            const allComments = [...customComments, ...apiComments].filter(c => !deletedIds.includes(c.id));
            app.removeChild(loader);

            const searchContainer = DOMUtils.createElement('div', { className: 'search-container' });
            const searchComponent = Search.render((query) => {
                const filteredList = CommentsList.render(
                    allComments,
                    query,
                    (comment) => this.handleAddComment(postId, comment),
                    (commentId) => this.handleRemoveComment(postId, commentId),
                    authorEmail
                );
                const oldList = document.querySelector('.comments-container');
                if (oldList) oldList.replaceWith(filteredList);
            });
            searchContainer.appendChild(searchComponent);
            app.appendChild(searchContainer);

            const commentsList = CommentsList.render(
                allComments,
                '',
                (comment) => this.handleAddComment(postId, comment),
                (commentId) => this.handleRemoveComment(postId, commentId),
                authorEmail
            );
            app.appendChild(commentsList);

        } catch (error) {
            if (app.contains(loader)) app.removeChild(loader);
            const errorMessage = DOMUtils.createElement('p', { className: 'error-message' }, 'Ошибка загрузки комментариев');
            app.appendChild(errorMessage);
        }
    },

    handleAddComment(postId, commentData) {
        StorageUtils.addUserComment(postId, commentData);
        this.render();
    },

    handleRemoveComment(postId, commentId) {
        StorageUtils.deleteComment(postId, commentId);
        this.render();
    }
};
