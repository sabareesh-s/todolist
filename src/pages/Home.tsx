import React, { FC, useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Todo } from '../components/Todo';
import { db } from '../firebase.js';
import { collection, onSnapshot, addDoc, updateDoc, doc, query, where, getDocs, deleteDoc  } from 'firebase/firestore';
import { TodoProps } from '../components/Todo';
import { nanoid } from 'nanoid'

export interface HomeProps {}

export const Home: FC<HomeProps> = ({}: HomeProps) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate('/login');
        console.log('Signed out successfully');
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const [todos, setTodos] = useState<TodoProps[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'todos'), (snapshot) => {
      setTodos(
        snapshot.docs
          .filter((doc) => doc.data().user === auth.currentUser?.uid)
          .map((doc) => {
            const data = doc.data();
            console.log('>>> data', data);
            return {
              user: data.user,
              id: data.id,
              todo: data.todo,
              done: data.done
            } as TodoProps;
          })
      );
    });
  
    return () => {
      unsubscribe(); // Unsubscribe from the snapshot listener when the component unmounts
    };
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const todoData = {user: auth.currentUser?.uid, id: nanoid(), todo: input, done: false };

    try {
      // Add the todo data to Firestore
      const docRef = await addDoc(collection(db, 'todos'), todoData);
      console.log('Todo added successfully with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding todo: ', error);
    }

    const unsubscribe = onSnapshot(collection(db, 'todos'), (snapshot) => {
        setTodos(
          snapshot.docs
            .filter((doc) => doc.data().user === auth.currentUser?.uid)
            .map((doc) => {
              const data = doc.data();
              console.log('>>> data', data);
              return {
                user: data.user,
                id: data.id,
                todo: data.todo,
                done: data.done
              } as TodoProps;
            })
        );
      });
    
      setInput('');
      
      return () => {
        unsubscribe(); // Unsubscribe from the snapshot listener when the component unmounts
      };

  };

  const handleTodoDoneChange = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const todoQuery = query(collection(db, 'todos'), where('id', '==', id));
  
    try {
      const querySnapshot = await getDocs(todoQuery);
      if (querySnapshot.empty) {
        console.log('Document not found');
        return;
      }

      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        done: !e.target.checked
      });
  
      console.log('Todo state updated successfully');
    } catch (error) {
      console.error('Error updating todo state: ', error);
    }
  };

  const handleTodoDelete = async (id: string) => {
    const todoQuery = query(collection(db, 'todos'), where('id', '==', id));
  
    try {
      const querySnapshot = await getDocs(todoQuery);
  
      if (querySnapshot.empty) {
        console.log('Document not found');
        return;
      }
  
      const docRef = querySnapshot.docs[0].ref;
      await deleteDoc(docRef);
  
      console.log('Todo deleted successfully');
    } catch (error) {
      console.error('Error deleting todo: ', error);
    }
  };
  

  return (
    <nav>
      <div className="absolute top-2 right-2">
        <button
          type="button"
          onClick={handleLogout}
          className="px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-80"
        >
          Logout
        </button>
      </div>

      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-5">
              <form onSubmit={addTodo} className="flex gap-5 items-stretch">
                <input
                  name="add todo"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Add todo"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
              </form>

              {todos.map((todo, index) => (
                <Todo user={todo.user} id={todo.id} key={index} todo={todo.todo} done={todo.done} onDelete={() => handleTodoDelete(todo.id)} onChange={(e) => handleTodoDoneChange(todo.id, e)}/>
              ))}
            </div>
          </div>
        </div>
      </section>
    </nav>
  );
};
