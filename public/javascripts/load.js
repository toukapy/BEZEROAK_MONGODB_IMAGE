let updateUser = (id) => {
    let row = document.getElementById(id);
    let izena = row.children[1].children[0].value;
    let abizena = row.children[2].children[0].value;
    let email = row.children[3].children[0].value;

    let formData = new FormData();

    formData.append("izena", izena);
    formData.append("abizena", abizena);
    formData.append("_id", id);
    formData.append("email", email);
    formData.append("avatar", row.children[1].children[0].files[0]);

    row.innerHTML = `
    <th scope="row">${id}</th>
    <td>${izena}</td>
    <td>${abizena}</td>
    <td>${email}</td>
    <td><img id="avat" class="rounded-circle" src="" width="50" height="50"/></td>
    <td> <a onclick="deleteUser('${id}')">[x]</a> <a onclick="editUser('${id}')">[e]</a>  </td>
    `;

    fetch(`/users/update/${id}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let img = document.getElementById("avat");
        img.src = `https://test.toukapy-ws.live/uploads/${data.avatar}`;
        img.removeAttribute("id");
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

let editUser = (id) => {
    let row = document.getElementById(id);
    let izena = row.children[1].innerHTML;
    let abizena = row.children[2].innerHTML;
    let email = row.children[3].innerHTML;
    row.innerHTML = `
    <th scope="row">${id}</th>
    <td><input type="text" id="izena" value="${izena}"></td>
    <td><input type="text" id="abizena" value="${abizena}"></td>
    <td><input type="text" id="email" value="${email}"></td>
    <td> <input type="button" onclick="updateUser('${id}')" value="Save"> </td>
    `;
}

let insertUser = (user) => {
  var tableBody = document.getElementById("userTableBody");

  // Loop through each user in the JSON array

  // Create a new row and set its innerHTML based on the user data
  var newRow = tableBody.insertRow();
  newRow.setAttribute("id", user._id);
  newRow.innerHTML = `
                <th scope="row">${user._id}</th>
                <td>${user.izena}</td>
                <td>${user.abizena}</td>
                <td>${user.email}</td>
                <td><img src="https://test.toukapy-ws.live/uploads/${user.avatar}" width="50" height="50"></td>
                <td><a onclick="deleteUser('${user._id}')">[x]</a> <a onclick="editUser('${user._id}')">[e]</a>  </td>
            `;
};

let deleteUser = (id) => {
    fetch(`/users/delete/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);  // handle the response data or action
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    let row = document.getElementById(id);
    row.parentNode.removeChild(row);
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("formularioa").addEventListener("submit", (e) => {
    e.preventDefault();

    const form = document.getElementById("formularioa");


    const formData = new FormData(form);

    fetch("/users/new", {
        method: "POST",
        body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        insertUser(data);
      })

      .catch((error) => {
        console.error("Error:", error);

    });

  });
  fetch("/users/list")
    .then((r) => r.json())
    .then((users) => {
      console.log(users);
      // Select the table body where new rows will be appended

      users.forEach((user) => {
        insertUser(user);
      });

  });



});
