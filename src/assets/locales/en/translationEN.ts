const translationEN = {
  errors: {
    errorsLogin: {
      required: 'Login is required',
      minLength: 'Login must be at least 3 characters',
      pattern: 'Login must contain only letters and numbers',
    },
    errorsName: {
      required: 'Name is required',
      minLength: 'Name must be at least 3 characters',
    },
    errorsPassword: {
      required: 'Password is required',
      minLength: 'Password must be at least 8 characters',
    },
  },
  header: {
    boards: 'Boards',
    login: 'Login / Sign up',
    logout: 'Logout',
    create: 'Create a new board',
  },
  welcom: {
    docTitle: 'Welcom',
    text: 'This application will help organize group work in the style of kanban. Try it out. Developed as part of the react course from rs.school.',
  },
  auth: {
    docTitle: 'Auth',
    login: 'Login',
    signUp: 'Sign Up',
    password: 'Password',
    register: 'Register',
    name: 'Name',
  },
  profile: {
    docTitle: 'profile',
    name: 'Name',
    login: 'Login',
    change: 'Change',
    password: 'Password',
    newPassword: 'Your new password',
    update: 'Update',
    delete: 'Delete my profile',
  },
  errorPage: {
    docTitle: 'Page not found',
    text: '404 bro',
  },
  main: {
    docTitle: 'Boards',
  },
  kanban: {
    addColumn: 'Add Column',
  },
  confirmationModal: {
    title: 'Are you sure?',
    ok: 'OK',
    cancel: 'Cancel',
    delete: {
      board: 'You will remove the board and all of its contents.',
      column:
        'You want to delete this column? All tasks will be deleted. This action cannot be undone.',
      task: 'You want to delete this task? This action cannot be undone.',
      user: 'You want to delete this user? This action cannot be undone.',
    },
  },
  creationModal: {
    ok: 'OK',
    cancel: 'Cancel',
    title: 'Title:',
    description: 'Description:',
    errors: {
      title: {
        required: 'Title is required',
        minLength: 'Title must be at least 3 characters',
        maxLength10: 'Title must be at most 10 characters',
        maxLength16: 'Title must be at most 16 characters',
      },
      description: {
        required: 'Description is required',
        minLength: 'Description must be at least 3 characters',
        maxLength144: 'Description must be at most 144 characters',
      },
    },
    creationBoard: {
      placeholder: 'Name of new board',
      title: 'Enter a title of new board',
    },
    creationColumn: {
      placeholder: 'Name of new column',
      title: 'Enter a title of new column',
    },
    creationTask: {
      titlePlaceholder: 'Name of new task',
      descriptionPlaceholder: 'Description of new task',
      title: 'Enter a new task',
    },
  },
};

export default translationEN;
