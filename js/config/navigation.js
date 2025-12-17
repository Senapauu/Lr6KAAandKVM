const NavigationConfig = {
    routes: {
        'users': {
            label: 'Пользователи',
            path: 'users'
        },
        'todos': {
            label: 'Задачи',
            path: 'users#todos',
            parent: 'users'
        },
        'posts': {
            label: 'Посты',
            path: 'users#posts',
            parent: 'users'
        },
        'comments': {
            label: 'Комментарии',
            path: 'users#posts#comments',
            parent: 'posts'
        }
    },

    getBreadcrumbs(currentPath) {
        const breadcrumbs = [];
        const parts = currentPath.split('#');

        breadcrumbs.push({
            label: this.routes['users'].label,
            path: this.routes['users'].path,
            active: parts.length === 1
        });

        if (parts.length >= 2) {
            const secondPart = parts[1].split('?')[0];
            if (this.routes[secondPart]) {
                breadcrumbs.push({
                    label: this.routes[secondPart].label,
                    path: this.routes[secondPart].path,
                    active: parts.length === 2
                });
            }
        }

        if (parts.length >= 3) {
            const thirdPart = parts[2].split('?')[0];
            if (this.routes[thirdPart]) {
                breadcrumbs.push({
                    label: this.routes[thirdPart].label,
                    path: this.routes[thirdPart].path,
                    active: true
                });
            }
        }

        return breadcrumbs;
    }
};
