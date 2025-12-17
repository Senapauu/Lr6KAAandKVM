const StorageUtils = {
    KEYS: {
        CUSTOM_USERS: 'spa_custom_users',
        USER_TODOS_PREFIX: 'todos_',
        USER_POSTS_PREFIX: 'posts_',
        USER_COMMENTS_PREFIX: 'comments_',
        DELETED_POSTS: 'spa_deleted_posts',
        DELETED_COMMENTS: 'spa_deleted_comments'
    },

    getCustomUsers() {
        const users = localStorage.getItem(this.KEYS.CUSTOM_USERS);
        return users ? JSON.parse(users) : [];
    },

    saveCustomUsers(users) {
        localStorage.setItem(this.KEYS.CUSTOM_USERS, JSON.stringify(users));
    },

    addCustomUser(user) {
        const users = this.getCustomUsers();
        const newUser = {
            ...user,
            id: Date.now(),
            isCustom: true,
            address: { city: 'N/A' },
            company: { name: user.companyName || 'N/A' }
        };
        users.push(newUser);
        this.saveCustomUsers(users);
        return newUser;
    },

    deleteCustomUser(userId) {
        const users = this.getCustomUsers();
        const filteredUsers = users.filter(u => u.id !== userId);
        this.saveCustomUsers(filteredUsers);
        localStorage.removeItem(`${this.KEYS.USER_TODOS_PREFIX}${userId}`);
    },

    mergeWithApiUsers(apiUsers) {
        const customUsers = this.getCustomUsers();
        return [...customUsers, ...apiUsers];
    },

    getUserTodos(userId) {
        const todos = localStorage.getItem(`${this.KEYS.USER_TODOS_PREFIX}${userId}`);
        return todos ? JSON.parse(todos) : [];
    },

    addUserTodo(userId, todo) {
        const todos = this.getUserTodos(userId);
        const newTodo = {
            ...todo,
            id: Date.now(),
            userId: userId,
            completed: false
        };
        todos.push(newTodo);
        localStorage.setItem(`${this.KEYS.USER_TODOS_PREFIX}${userId}`, JSON.stringify(todos));
        return newTodo;
    },

    getUserPosts(userId) {
        const posts = localStorage.getItem(`${this.KEYS.USER_POSTS_PREFIX}${userId}`);
        return posts ? JSON.parse(posts) : [];
    },

    addUserPost(userId, post) {
        const posts = this.getUserPosts(userId);
        const newPost = {
            ...post,
            id: Date.now(),
            userId: userId
        };
        posts.push(newPost);
        localStorage.setItem(`${this.KEYS.USER_POSTS_PREFIX}${userId}`, JSON.stringify(posts));
        return newPost;
    },

    getUserComments(postId) {
        const comments = localStorage.getItem(`${this.KEYS.USER_COMMENTS_PREFIX}${postId}`);
        return comments ? JSON.parse(comments) : [];
    },

    addUserComment(postId, comment) {
        const comments = this.getUserComments(postId);
        const newComment = {
            ...comment,
            id: Date.now(),
            postId: postId
        };
        comments.push(newComment);
        localStorage.setItem(`${this.KEYS.USER_COMMENTS_PREFIX}${postId}`, JSON.stringify(comments));
        return newComment;
    },

    getDeletedPosts() {
        const deleted = localStorage.getItem(this.KEYS.DELETED_POSTS);
        return deleted ? JSON.parse(deleted) : [];
    },

    deletePost(userId, postId) {
        if (postId > 10000000000) {
            const posts = this.getUserPosts(userId);
            const filtered = posts.filter(p => p.id != postId);
            localStorage.setItem(`${this.KEYS.USER_POSTS_PREFIX}${userId}`, JSON.stringify(filtered));
        } else {
            const deleted = this.getDeletedPosts();
            if (!deleted.includes(postId)) {
                deleted.push(postId);
                localStorage.setItem(this.KEYS.DELETED_POSTS, JSON.stringify(deleted));
            }
        }
    },

    getDeletedComments() {
        const deleted = localStorage.getItem(this.KEYS.DELETED_COMMENTS);
        return deleted ? JSON.parse(deleted) : [];
    },

    deleteComment(postId, commentId) {
        if (commentId > 10000000000) {
            const comments = this.getUserComments(postId);
            const filtered = comments.filter(c => c.id != commentId);
            localStorage.setItem(`${this.KEYS.USER_COMMENTS_PREFIX}${postId}`, JSON.stringify(filtered));
        } else {
            const deleted = this.getDeletedComments();
            if (!deleted.includes(commentId)) {
                deleted.push(commentId);
                localStorage.setItem(this.KEYS.DELETED_COMMENTS, JSON.stringify(deleted));
            }
        }
    }
};
