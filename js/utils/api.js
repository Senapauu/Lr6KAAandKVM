const API = {
    BASE_URL: 'https://jsonplaceholder.typicode.com',

    async fetch(endpoint) {
        try {
            const response = await fetch(`${this.BASE_URL}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async fetchUsers() {
        return this.fetch('/users');
    },

    async fetchTodos(userId) {
        if (!userId) {
            return this.fetch('/todos');
        }
        return this.fetch(`/todos?userId=${userId}`);
    },

    async fetchPosts(userId) {
        if (!userId) {
            return this.fetch('/posts');
        }
        return this.fetch(`/posts?userId=${userId}`);
    },

    async fetchComments(postId) {
        if (!postId) {
            return this.fetch('/comments');
        }
        return this.fetch(`/comments?postId=${postId}`);
    }
};
