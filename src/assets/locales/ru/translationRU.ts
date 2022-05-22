const translationRU = {
  errors: {
    errorsLogin: {
      required: 'Укажите логин',
      minLength: 'Логин должен быть не менее 3-х символов',
      pattern: 'Логин должен содержать только буквы и цифры',
    },
    errorsName: {
      required: 'Укажите имя',
      minLength: 'Имя должно быть не менее 3 символов',
    },
    errorsPassword: {
      required: 'Укажите пароль',
      minLength: 'Пароль должен быть не менее 8 символов',
    },
  },
  header: {
    boards: 'Доски',
    login: 'Войти / Регистрация',
    logout: 'Выйти',
    create: 'Создать новую доску',
  },
  welcom: {
    docTitle: 'Добро пожаловать',
    text: 'Это приложение поможет организовать групповую работу в стиле канбан. Попробуй, ещё захочешь. Разработано в рамках курса react от rs.school.',
  },
  auth: {
    docTitle: 'Авторизация',
    login: 'Войти',
    signUp: 'Регистрация',
    password: 'Пароль',
    register: 'Зарегистрироваться',
    name: 'Имя',
  },
  profile: {
    docTitle: 'профиль',
    name: 'Имя',
    login: 'Войти',
    change: 'Изменить',
    password: 'Пароль',
    newPassword: 'Ваш новый пароль',
    update: 'Обновить',
    delete: 'Удалить мой профиль',
  },
  errorPage: {
    docTitle: 'Страница не найдена',
    text: '404 братишка',
  },
  main: {
    docTitle: 'Доски',
  },
  kanban: {
    addColumn: 'Добавить столбец',
  },
  confirmationModal: {
    title: 'ВЫ уверены?',
    ok: 'OK',
    cancel: 'Отмена',
    delete: {
      board: 'Вы удалите доску и все ее содержимое.',
      column:
        'Вы хотите удалить этот столбец? Все задачи будут удалены. Это действие не может быть отменено.',
      task: 'Вы хотите удалить эту задачу? Это действие не может быть отменено.',
      user: 'Вы хотите удалить этого пользователя? Это действие не может быть отменено.',
    },
  },
  creationModal: {
    ok: 'OK',
    cancel: 'Отмена',
    title: 'Заголовок:',
    description: 'Описание:',
    errors: {
      title: {
        required: 'Укажите заголовок',
        minLength: 'Заголовок должен быть не менее 3 символов',
        maxLength10: 'Заголовок должен содержать не более 10 символов',
        maxLength16: 'Заголовок должен содержать не более 16 символов',
      },
      description: {
        required: 'Укажите описание',
        minLength: 'Описание должно быть не менее 3 символов',
        maxLength144: 'Описание должно быть не более 144 символов',
      },
    },
    creationBoard: {
      placeholder: 'Заголовок новой доски',
      title: 'Введите заголовок новой доски',
    },
    creationColumn: {
      placeholder: 'Заголовок нового столбца',
      title: 'Введите заголовок нового столбца',
    },
    creationTask: {
      titlePlaceholder: 'Заголовок новой задачи',
      descriptionPlaceholder: 'Описание новой задачи',
      title: 'Введите новую задачу',
    },
    changeTask: {
      titlePlaceholder: 'Заголовок текущей задачи',
      descriptionPlaceholder: 'Описание текущей задачи',
      title: 'Измените текущую задачу',
    },
  },
};

export default translationRU;
