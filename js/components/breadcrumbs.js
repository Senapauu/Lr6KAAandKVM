const Breadcrumbs = {
    render(breadcrumbs) {
        const nav = DOMUtils.createElement('nav', { className: 'breadcrumbs' });

        breadcrumbs.forEach((crumb, index) => {
            if (index > 0) {
                nav.appendChild(DOMUtils.createElement('span', { className: 'breadcrumbs__separator' }, '/'));
            }

            if (crumb.active) {
                const span = DOMUtils.createElement('span', { className: 'breadcrumbs__item breadcrumbs__item--active' }, crumb.label);
                nav.appendChild(span);
            } else {
                const link = DOMUtils.createElement('a', {
                    className: 'breadcrumbs__item',
                    href: `#${crumb.path}`
                }, crumb.label);
                nav.appendChild(link);
            }
        });

        return nav;
    }
};
