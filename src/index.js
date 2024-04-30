const postsListRef = document.querySelector(".posts__list");
const registrFormRef = document.querySelector(".registr__form");
const backdropRegistrRef = document.querySelector(".backdrop");
const nicknameErrRef = document.querySelector(".nickname-error");
const nicknameErrLoginRef = document.querySelector(".nickname-error-login");
const loginBtnRef = document.querySelector(".login__button");
const backdropLoginRef = document.querySelector(".backdrop-login");
const registrLoginBtnRef = document.querySelector(".registr-login__button");
const loginRegistrBtnRef = document.querySelector(".login-registr__button");
const loginFormRef = document.querySelector(".login__form");
const welcomeMesageRef = document.querySelector(".welcome__message");
const addPostBtnRef = document.querySelector(".add-post__button");
const addPostFormRef = document.querySelector(".add-post__form");
const closeAddPostRef = document.querySelector(".close-add-post__btn");
const backdropAddPostRef = document.querySelector(".backdrop-add-post");
const editBackdropRef = document.querySelector(".backdrop-edit");
const closeEditPostBtnRef = document.querySelector(".close-edit-post__btn");
const editFormRef = document.querySelector(".edit__form");
const editPostDescriptionRef = document.querySelector(
  ".edit-post__description"
);

async function basePosts() {
  try {
    const res = await fetch("http://localhost:3000/posts");
    const data = await res.json();
    return data;
  } catch (err) {
    console.log("err", err);
  }
}

basePosts().then((data) => {
  // console.log(data);
  data.reverse().forEach((post) => {
    postsListRef.insertAdjacentHTML(
      "beforeend",
      `<li class="posts__item" data-id="${post.id}">
        <div class="post-box">
            <img src="${post.authorAvatarUrl}" class="user-avatar__img"/>
            <h2 class="post-author__nickname">${post.authorNickname}</h2>
        </div>
        <h2 class="post__description">${post.description}</h2>
        <button type="button" class="edit-post__button">
          <img src="./imgs/pencil.svg" />
        </button>
        <button type="button" class="delete-post__button">
          <img src="./imgs/delete.svg" />
        </button>
      </li>`
    );
  });
});

async function registrUser(newUser) {
  try {
    const res = await fetch(`http://localhost:3000/users`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log("err", err);
  }
}

registrFormRef.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  const res = await fetch(`http://localhost:3000/users`);
  const data = await res.json();
  let isValidNickname = true;

  data.forEach((user) => {
    if (user.nickname === evt.target.elements.nickname.value) {
      nicknameErrRef.style.display = "block";
      isValidNickname = false;
    }
  });
  if (isValidNickname) {
    const newUser = {
      userName: evt.target.elements.username.value,
      nickname: evt.target.elements.nickname.value,
      password: evt.target.elements.password.value,
      // avatarUrl: evt.target.elements.avatarUrl.files[0].value,
    };
    // console.log(newUser);
    registrUser(newUser).then((data) => {
      // console.log(data);
    });
    sessionStorage.setItem("registrUser", JSON.stringify(newUser));
    backdropRegistrRef.style.opacity = 0;
    backdropRegistrRef.style.display = "none";
    welcomeMesageRef.textContent = `Welcome ${newUser.nickname}`;
    evt.target.reset();
  }
});

registrLoginBtnRef.addEventListener("click", () => {
  backdropLoginRef.style.display = "block";
  backdropRegistrRef.style.display = "none";
});

loginRegistrBtnRef.addEventListener("click", () => {
  backdropRegistrRef.style.display = "block";
  backdropLoginRef.style.display = "none";
});

async function checkLoginData() {
  try {
    const res = await fetch(`http://localhost:3000/users`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log("err", err);
  }
}

loginFormRef.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const userObj = {
    nickname: evt.target.elements.nickname.value,
    password: evt.target.elements.password.value,
  };

  checkLoginData().then((data) => {
    data.forEach((user) => {
      if (
        user.nickname === userObj.nickname &&
        user.password === userObj.password
      ) {
        welcomeMesageRef.textContent = `Welcome, ${user.nickname}`;
        sessionStorage.setItem("loginUser", JSON.stringify(user));
        backdropLoginRef.style.display = "none";
      } else {
        nicknameErrLoginRef.style.display = "block";
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", (evt) => {
  if (
    sessionStorage.getItem("loginUser") !== null &&
    sessionStorage.getItem("loginUser") !== null
  ) {
    backdropLoginRef.style.display = "none";
    backdropRegistrRef.style.opacity = "0";
    backdropRegistrRef.style.display = "none";
    welcomeMesageRef.textContent = `Welcome ${
      JSON.parse(sessionStorage.getItem("loginUser")).nickname
    }`;
  }
  if (
    sessionStorage.getItem("registrUser") !== null &&
    sessionStorage.getItem("registrUser") !== undefined
  ) {
    backdropRegistrRef.style.opacity = "0";
    backdropRegistrRef.style.display = "none";
    welcomeMesageRef.textContent = `Welcome ${
      JSON.parse(sessionStorage.getItem("registrUser")).nickname
    }`;
  }
});

addPostBtnRef.addEventListener("click", (evt) => {
  backdropAddPostRef.classList.toggle("is-hidden-add-post");
});

closeAddPostRef.addEventListener("click", (evt) => {
  backdropAddPostRef.classList.toggle("is-hidden-add-post");
});

async function addPost(postToAdd) {
  try {
    const res = await fetch("http://localhost:3000/posts", {
      method: "POST",
      body: JSON.stringify(postToAdd),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log("err", err);
  }
}

addPostFormRef.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const newPost = {
    description: evt.target.elements.addPostDescription.value,
    authorNickname:
      sessionStorage.getItem("registrUser") !== null &&
      sessionStorage.getItem("registrUser") !== undefined
        ? JSON.parse(sessionStorage.getItem("registrUser")).nickname
        : JSON.parse(sessionStorage.getItem("loginUser")).nickname,
  };

  addPost(newPost).then((post) => {
    postsListRef.insertAdjacentHTML(
      "beforebegin",
      `<li class="posts__item">
            <div class="post-box">
                <img src="${backdropAddPostRef}" class="user-avatar__img"/>
                <h2>${post.authorNickname}</h2>
            </div>
            <h2 class="post__description">${post.description}</h2>
          </li>`
    );
    backdropAddPostRef.classList.toggle("is-hidden-add-post");
    evt.target.reset();
    document.location.reload();
  });
});

async function editPost(editedPost, idEditedPost) {
  try {
    const res = await fetch(`http://localhost:3000/posts/${idEditedPost}`, {
      method: "PATCH",
      body: JSON.stringify(editedPost),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log("err", err);
  }
}

setTimeout(() => {
  const editPostBtnsRef = document.querySelectorAll(".edit-post__button");

  editPostBtnsRef.forEach((btn) => {
    // console.log(btn.parentNode.getAttribute('data-id'))
    btn.addEventListener("click", () => {
      const postAuthorNickname = btn.parentNode.querySelector(
        ".post-author__nickname"
      ).textContent;
      const currentUserNickname =
        sessionStorage.getItem("registrUser") !== null &&
        sessionStorage.getItem("registrUser") !== undefined
          ? JSON.parse(sessionStorage.getItem("registrUser")).nickname
          : JSON.parse(sessionStorage.getItem("loginUser")).nickname;
      if (postAuthorNickname !== currentUserNickname) {
        alert("This is not your post");
        return;
      }
      editBackdropRef.classList.toggle("is-hidden-edit");
      editPostDescriptionRef.value =
        btn.parentNode.querySelector(".post__description").textContent;
      editFormRef.setAttribute(
        "data-id",
        btn.parentNode.getAttribute("data-id")
      );
    });
  });

  editFormRef.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const postToUpdate = {
      description: evt.target.elements.editDescription.value,
    };
    editPost(postToUpdate, evt.target.getAttribute("data-id")).then((data) => {
      // console.log(data);
    });
    document.querySelector(
      `.posts__item[data-id="${editFormRef.getAttribute(
        "data-id"
      )}"] .post__description`
    ).textContent = postToUpdate.description;
    editBackdropRef.classList.toggle("is-hidden-edit");
  });
}, 50);

closeEditPostBtnRef.addEventListener("click", () =>
  editBackdropRef.classList.toggle("is-hidden-edit")
);

// ?delete post
async function deletePost(idPostToDel) {
  try {
    const res = await fetch(`http://localhost:3000/posts/${idPostToDel}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log("err", err);
  }
}

setTimeout(() => {
  const delPostBtsRef = document.querySelectorAll(".delete-post__button");
  let idDeletedPost = "";

  delPostBtsRef.forEach((btn) => {
    btn.addEventListener("click", () => {
      const postAuthorNickname = btn.parentNode.querySelector(
        ".post-author__nickname"
      ).textContent;
      const currentUserNickname =
        sessionStorage.getItem("registrUser") !== null &&
        sessionStorage.getItem("registrUser") !== undefined
          ? JSON.parse(sessionStorage.getItem("registrUser")).nickname
          : JSON.parse(sessionStorage.getItem("loginUser")).nickname;
      if (postAuthorNickname !== currentUserNickname) {
        alert("This is not your post");
        return;
      }
      const isDeletePost = confirm("are you sure you want to delete the post?");
      if (isDeletePost) {
        deletePost(btn.parentNode.getAttribute("data-id")).then((data) => {
          document.location.reload();
        });
      }
    });
  });
}, 50);
