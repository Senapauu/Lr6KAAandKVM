const Router = {
    routes: {},

    init() {
        window.addEventListener('hashchange', () => this.handleRouteChange());
        this.handleRouteChange();
    },

    register(path, callback) {
        this.routes[path] = callback;
    },

    handleRouteChange() {
        const hash = window.location.hash || '#users';
        const routeData = this.parseRoute(hash);

        if (this.routes[routeData.path]) {
            this.routes[routeData.path]();
        } else {
            window.location.hash = '#users';
        }
    },

    parseRoute(hash) {
        const cleanHash = hash.replace(/^#/, '');
        const parts = cleanHash.split('#');
        const lastPart = parts[parts.length - 1];
        const path = lastPart.split('?')[0];

        const params = {};
        const queryPart = lastPart.split('?')[1];
        if (queryPart) {
            const queryParams = new URLSearchParams(queryPart);
            if (queryParams.has('userId')) params.userId = parseInt(queryParams.get('userId'));
            if (queryParams.has('postId')) params.postId = parseInt(queryParams.get('postId'));
        }

        return { path, params };
    },

    navigate(path) {
        window.location.hash = path;
    }
};
