document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    Router.register('users', () => {
        UsersPage.render();
    });

    Router.register('todos', () => {
        TodosPage.render();
    });

    Router.register('posts', () => {
        PostsPage.render();
    });

    Router.register('comments', () => {
        CommentsPage.render();
    });

    Router.init();
}
