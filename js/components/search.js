const Search = {
    render(onSearch) {
        const container = DOMUtils.createElement('div', { className: 'search' });

        const input = DOMUtils.createElement('input', {
            type: 'text',
            className: 'search__input',
            placeholder: 'Поиск...',
            onInput: DOMUtils.debounce((e) => {
                onSearch(e.target.value);
            }, 300)
        });

        container.appendChild(input);
        return container;
    }
};
