import './App.css';
import {useState, useEffect } from "react";

function App() {

const [name, setName] = useState("");
const [comment, setComment] = useState(0);
const [listOfFriends, setListOfFriends] = useState([]);

// CREATE
const addFriend = async () => {
    async function fetchPOST_addFriend(input_name, input_comment) {
      let data = new URLSearchParams();
      // URLSearchParams() take the current URL and get the object after "?"
      // https://googlechrome.github.io/samples/urlsearchparams/
      data.append("name", input_name);
      data.append("comment", input_comment);
  
      await fetch("https://five610-project3-server.onrender.com/addFriend", {
        method: "post",
        body: data,
      })
        // .then(()=>alert("yey it worked!"))
        .then((res) => res.text())
        .then((txt) => {
          console.log(txt);
          setListOfFriends([...listOfFriends, {name: name, comment: comment}])
          console.log(listOfFriends)
        })
        .catch((err) => {
          console.log(err);
          alert("it doesn't worked!")
        });
    }
    await fetchPOST_addFriend(name, comment);
};

// UPDATE
const updateFriend = async (id) => {
  const newComment = prompt("Enter new comment: ");
  async function fetchPOST_updateCommentById(target_id, newComment) {
    let data = new URLSearchParams();
    data.append("_id", target_id);
    data.append("comment", newComment);

    await fetch("https://five610-project3-server.onrender.com/updateCommentById", {
      method: "post",
      body: data,
    })
      .then((res) => res.text())
      .then((txt) => {
        console.log(txt);
        setListOfFriends(listOfFriends.map((val) => {
          return val._id === id ? {_id: id, name:val.name, comment:newComment} : val
        }))
      })
      .catch((err) => {
        console.log(err);
      });
  }
  await fetchPOST_updateCommentById(id, newComment);
}

// DELETE
const deleteFriend = async (id) => {
  async function fetchPOST_deleteById(target_id) {
    let data = new URLSearchParams();
    data.append("_id", target_id);

    fetch("https://five610-project3-server.onrender.com/deleteById", {
      method: "post",
      body: data,
    })
      .then((res) => res.text())
      .then((txt) => {
        console.log(txt);
        setListOfFriends(listOfFriends.filter((val) => {
          return val._id !== id;
        }))
      })
      .catch((err) => {
        console.log(err);
      });
  }
  fetchPOST_deleteById(id)
}

// everytime the listOfFriends state change
// fetch all data from database again, and rerender
useEffect(() => {
  async function fetchGET_findAllFriends() {
    await fetch("https://five610-project3-server.onrender.com/findAllFriends")
      .then((res) => res.json())
      .then((txt) => {  
        setListOfFriends(txt);
        console.log(txt);
      })
      .catch((err) => { console.log(err); });
  }
  fetchGET_findAllFriends();
}, [listOfFriends.length])

  return (
    <div className="App">
      <input type="text" placeholder='User name...' onChange={(e) => {setName(e.target.value)}} />
      <input type="text" placeholder='Make a comment...' onChange={(e) => {setComment(e.target.value)}} />
      <button onClick={addFriend}>add friend</button>
        {listOfFriends.map((val) => {
          return (
            <div key={val._id}>
              <div> {val.name} : {val.comment}</div>
              <button onClick={() => {updateFriend(val._id)}} >update message</button>
              <button onClick={() => {deleteFriend(val._id)}}>X</button>
            </div>
            )
        })}
    </div>
  );
}

export default App;
