const PostsPage = {
    async render() {
        const app = document.getElementById('app');
        DOMUtils.clearElement(app);

        const pageHeader = DOMUtils.createElement('div', { className: 'page-header' });
        const breadcrumbs = Breadcrumbs.render(NavigationConfig.getBreadcrumbs('users#posts'));
        const title = DOMUtils.createElement('h1', { className: 'page-title' }, 'Посты');

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
            const posts = await API.fetchPosts(userId);
            const customPosts = StorageUtils.getUserPosts(userId);
            const deletedIds = StorageUtils.getDeletedPosts();

            const allPosts = [...customPosts, ...posts].filter(p => !deletedIds.includes(p.id));
            app.removeChild(loader);

            const searchContainer = DOMUtils.createElement('div', { className: 'search-container' });
            const searchComponent = Search.render((query) => {
                const filteredList = PostsList.render(
                    allPosts,
                    query,
                    isCustomUser ? (post) => this.handleAddPost(userId, post) : null,
                    isCustomUser ? (postId) => this.handleRemovePost(userId, postId) : null
                );
                const oldList = document.querySelector('.posts-container');
                if (oldList) oldList.replaceWith(filteredList);
            });
            searchContainer.appendChild(searchComponent);
            app.appendChild(searchContainer);

            const postsList = PostsList.render(
                allPosts,
                '',
                isCustomUser ? (post) => this.handleAddPost(userId, post) : null,
                isCustomUser ? (postId) => this.handleRemovePost(userId, postId) : null
            );
            app.appendChild(postsList);

        } catch (error) {
            if (app.contains(loader)) app.removeChild(loader);
            app.appendChild(DOMUtils.createElement('p', { className: 'error-message' }, 'Ошибка загрузки постов'));
        }
    },

    handleAddPost(userId, postData) {
        StorageUtils.addUserPost(userId, postData);
        this.render();
    },

    handleRemovePost(userId, postId) {
        StorageUtils.deletePost(userId, postId);
        this.render();
    }
};
