let updateUser = (id) => {
    let row = document.getElementById(id);
    let izena = row.children[1].children[0].value;
    let abizena = row.children[2].children[0].value;
    let email = row.children[3].children[0].value;
    row.innerHTML = `
    <th scope="row">${id}</th>
    <td>${izena}</td>
    <td>${abizena}</td>
    <td>${email}</td>
    <td> <a onclick="deleteUser('${id}')">[x]</a> <a onclick="editUser('${id}')">[e]</a>  </td>
    `;

    let user = {
        izena: izena,
        abizena: abizena,
        id: id,
        email: email
    }

    fetch(`/users/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);  // handle the response data or action
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
                <td><a href="https://test.toukapy-ws.live/uploads/${user.avatar}">Image</a></td>
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

    const avatarInput = document.getElementById("avatar");


    const izena = e.target.izena.value;
    const abizena = e.target.abizena.value;
    const email = e.target.email.value;

    let user = {
        izena: izena,
        abizena: abizena,
        _id: Date.now(),
        email: email,
        avatar: avatarInput.files[0]
    }

    //insertUser(user);

    const formData = new FormData();
    formData.append("avatar", avatarInput.files[0]);
    formData.append("izena", izena);
    formData.append("abizena", abizena);
    formData.append("email", email);
    formData.append("id", user._id);

    fetch("/users/new", {
        method: "POST",
        body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // handle the response data or action
        insertUser(data);
      })
      .catch((error) => {
        console.error("Error:", error);

    });



      // Sample JSON array of users

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
});
