import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
import { createTodo, updateTodo, deleteTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";
import { onCreateTodo } from "./graphql/subscriptions";

Amplify.configure(awsconfig);

//values
const signout_button = document.getElementById("sign_out_button");
const save_button = document.getElementById("save_items_button");
const todo_button = document.getElementById("addBtn");
const todo_input = document.getElementById("todo_input");
const todos = document.getElementById("myUL");

Auth.currentUserInfo().then((info) => {
  //mutation. adding todos
  async function add_todo() {
    console.log(todo_input.value);
    const todo = {
      data: todo_input.value,
      user: info.id,
      isCompleted: false,
    };
    return await API.graphql(graphqlOperation(createTodo, { input: todo }));
  }
  //query. reading todos
  async function get_todo() {
    API.graphql(
      graphqlOperation(listTodos, {
        filter: { user: { contains: info.id } },
      })
    ).then((todo_list) => {
      todos.innerHTML = "";
      todo_list.data.listTodos.items.forEach((i) => {
        console.log(i.isCompleted);
        if (i.isCompleted) {
          todos.innerHTML += `<li class="todo_item" id=${i.id}>
          <del>${i.data}</del>
          <span class=${i.id}delete id=${i.id}delete style="border-style:solid;">--------Delete</span>
          </li>`;
        } else {
          todos.innerHTML += `<li class="todo_item" id=${i.id}>
          ${i.data}
          <span class=${i.id}delete id=${i.id}delete style="border-style:solid;">--------Delete</span>
          </li>`;
        }
      });
      //making list items updatable
      function item_clickable() {
        //get all todo items
        var all_items_array = document.getElementsByClassName("todo_item");
        //add update event listner on each item
        for (let item of all_items_array) {
          var i = document.getElementById(item.id);
          i.addEventListener("click", async function () {
            //mutation. updating todos. changing isCompleted to true
            const update_todo = {
              id: item.id,
              isCompleted: true,
            };
            return await API.graphql(
              graphqlOperation(updateTodo, { input: update_todo })
            );
          });
        }
      }
      //adding delete functionality
      function delete_item() {
        //get delete item
        var all = todo_list.data.listTodos.items;
        all.forEach((i) => {
          var element = document.getElementById(`${i.id}delete`);
          // console.log(element);
          element.addEventListener("click", async function () {
            // mutation. deleting todos
            document.getElementById(`${i.id}`).style.visibility = "hidden";
            const delete_todo = {
              id: i.id,
            };
            return await API.graphql(
              graphqlOperation(deleteTodo, { input: delete_todo })
            );
          });
        });
      }
      item_clickable();
      delete_item();
    });
  }
  $("document").ready(get_todo());
  //add todo button click
  todo_button.addEventListener("click", () => {
    if (todo_input.value != "") {
      add_todo();
    }
  });
});

//sign out button click
signout_button.addEventListener("click", async function () {
  try {
    await Auth.signOut();
    window.location.replace("auth.html");
  } catch (error) {
    console.log("error signing out: ", error);
  }
});

//save items button click
save_button.addEventListener("click", function () {
  location.reload();
  return false;
});

//verify whether there is a user logged in
Auth.currentSession()
  .then((data) => {
    document.getElementById("current_user").innerHTML =
      "Current User: " + data.idToken.payload.email;
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
    window.location.replace("auth.html");
  });
//subscription
API.graphql(graphqlOperation(onCreateTodo)).subscribe({
  next: (evt) => {
    const todo = evt.value.data.onCreateTodo;
    if (todo.isCompleted) {
      todos.innerHTML += `<li class="todo_item" id=${todo.id}>
      <del>${i.data}</del>
      <span class=${todo.id}delete id=${todo.id}delete style="border-style:solid;">--------Delete</span>
      </li>`;
    } else {
      todos.innerHTML += `<li class="todo_item" id=${todo.id}>
      ${todo.data}
      <span class=${todo.id}delete id=${todo.id}delete style="border-style:solid;">--------Delete</span>
      </li>`;
    }
  },
});
