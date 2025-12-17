const AddUserModal = {
    render(onAdd) {
        const overlay = DOMUtils.createElement('div', { className: 'modal-overlay' });
        const content = DOMUtils.createElement('div', { className: 'modal-content' });

        const header = DOMUtils.createElement('div', { className: 'modal-header' });
        header.appendChild(DOMUtils.createElement('h2', {}, 'Новый пользователь'));

        const closeBtn = DOMUtils.createElement('button', {
            className: 'modal-close',
            onClick: () => this.close()
        }, '×');
        header.appendChild(closeBtn);

        const form = DOMUtils.createElement('form', {
            className: 'modal-form',
            onSubmit: (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const userData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    companyName: formData.get('company')
                };

                if (!userData.name || !userData.email) {
                    alert('Заполните обязательные поля');
                    return;
                }

                onAdd(userData);
                this.close();
            }
        });

        const nameGroup = this.createInputGroup('Имя *', 'name', 'text', true);
        const emailGroup = this.createInputGroup('Email *', 'email', 'email', true);
        const companyGroup = this.createInputGroup('Компания', 'company', 'text');

        const submitBtn = DOMUtils.createElement('button', {
            type: 'submit',
            className: 'btn btn--primary'
        }, 'Добавить');

        form.appendChild(nameGroup);
        form.appendChild(emailGroup);
        form.appendChild(companyGroup);
        form.appendChild(submitBtn);

        content.appendChild(header);
        content.appendChild(form);
        overlay.appendChild(content);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.close();
        });

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
    },

    createInputGroup(labelStr, name, type, required = false) {
        const group = DOMUtils.createElement('div', { className: 'form-group' });
        group.appendChild(DOMUtils.createElement('label', { for: name }, labelStr));
        group.appendChild(DOMUtils.createElement('input', {
            type: type,
            id: name,
            name: name,
            required: required
        }));
        return group;
    },

    close() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    }
};
