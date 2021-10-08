import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';
const getLocalStorage = () => {
  //how to get an item from local storage
  let list = localStorage.getItem('list');
  if (list) {
    //must then parse list.
    return (list = JSON.parse(localStorage.getItem('list')));
  } else {
    return [];
  }
};
function App() {
  const [name, setName] = useState('');

  //gets from fucntion above
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    //If no name
    if (!name) {
      showAlert(true, 'danger', 'please enter value');
    } 
    //if there is a name and is  editing an item
    else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name }; //just change the title of the object, not the id
          }
          return item;
        })
      );
      //set the name to nothing again
      setName('');

      //set the editID to nothing again
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'success', 'value changed');
    }
     else {
      showAlert(true, 'success', 'item added to the list');
      const newItem = { id: new Date().getTime().toString(), title: name };

      setList([...list, newItem]);
      setName('');
    }
  };

  //Showing an alert using setAlert
  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

  //Clear the list
  const clearList = () => {
    showAlert(true, 'danger', 'empty list');
    setList([]);
  };

  //Recreate the list with all items not equal to that item.
  const removeItem = (id) => {
    showAlert(true, 'danger', 'item removed');
    setList(list.filter((item) => item.id !== id));
  };

  //
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  //set the list item in localstorage at every rendering of list
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);



  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}

        <h3>grocery bud</h3>
        <div className='form-control'>
          <input
            type='text'
            className='grocery'
            placeholder='e.g. eggs'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className='grocery-container'>
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className='clear-btn' onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
