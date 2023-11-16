/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Error } from './Error';
import { TodoList } from './TodoList';
import { Header } from './Header';
import { Footer } from './Footer';
import { useTodo } from './TodoContext';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorStatus } from './types/Error';

type Props = {
  visibleTodos: Todo[];
};

const USER_ID = 9968;

export const App: React.FC<Props> = ({
  visibleTodos,
}) => {
  const {
    todos,
    setTodos,
    error,
    setError,
  } = useTodo();
  const [isVisible, setIsVisible] = useState(false);
  const { pathname } = useLocation();
  const [filter, setFilter] = useState(FilterStatus.all);
  // eslint-disable-next-line
  const timer1 = useRef<any>(0);
  // eslint-disable-next-line
  const timer2 = useRef<any>(0);

  const active = todos.filter(todo => todo.completed === false).length;
  const completed = todos.filter(todo => todo.completed).length;

  const toggleAll = todos.map(todo => (
    {
      ...todo,
      completed: true,
    }
  ));

  const untoggleAll = todos.map(todo => (
    {
      ...todo,
      completed: false,
    }
  ));

  useEffect(() => {
    if (pathname === '/completed') {
      setFilter(FilterStatus.completed);
    }

    if (pathname === '/active') {
      setFilter(FilterStatus.active);
    }
  }, [pathname]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos);
  }, []);

  useEffect(() => {
    if (timer1.current) {
      clearTimeout(timer1.current);
    }

    if (timer2.current) {
      clearTimeout(timer2.current);
    }

    if (error) {
      timer1.current = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      timer2.current = setTimeout(() => {
        setError(ErrorStatus.none);
      }, 3700);
    } else {
      setIsVisible(true);
    }
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={todos}
              visibleTodos={visibleTodos}
              toggleAll={toggleAll}
              untoggleAll={untoggleAll}
            />

            <Footer
              todos={todos}
              active={active}
              completed={completed}
              filter={filter}
              setFilter={setFilter}
              setTodos={setTodos}
            />
          </>
        )}
      </div>

      {error && (
        <Error
          text={error}
          isVisible={isVisible}
        />
      )}
    </div>
  );
};
