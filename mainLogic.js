const baseUrl = "https://tarmeezacademy.com/api/v1"

function setupUI() {
    
    const token = localStorage.getItem("token")

    const loginDiv = document.getElementById("logged-in-div")
    const logoutDiv = document.getElementById("logout-div")

    // add button

    const addBtn = document.getElementById("add-btn")

    if (token == null) { // for guest user (not logged in)

        if (addBtn != null) {
            addBtn.style.setProperty("display", "none", "important")
        }
        
        loginDiv.style.setProperty("display", "flex", "important")
        logoutDiv.style.setProperty("display", "none", "important")
    } else { // for logged in user

        if (addBtn != null) {
            addBtn.style.setProperty("display", "block", "important")
        }

        loginDiv.style.setProperty("display", "none", "important")
        logoutDiv.style.setProperty("display", "flex", "important")
        const user = getCurrentUser()
        document.getElementById("nav-username").innerHTML = user.username
        document.getElementById("nav-user-image").src = user.profile_image
    }
}


function showAlert(messageAlert, type='success') {

    const alertPlaceholder = document.getElementById('succussAlert')

    const alert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    alert(messageAlert, type)

    // hide the alert
    setTimeout(() => {
        const alertToHide = bootstrap.Alert.getOrCreateInstance('#succussAlert')
        // alertToHide.close()
    }, 2000);
    
}  

function loginBtnClicked() {

    const username = document.getElementById('username-input').value
    const password = document.getElementById('password-input').value

        const params = {
        'username': username,
        'password': password
    }

    const url = `${baseUrl}/login`
    toggleLoader(true)
    axios.post(url, params)
    .then(function (response) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        const model = document.getElementById("login-modal")
        const modalInnstance = bootstrap.Modal.getInstance(model)
        modalInnstance.hide()
        showAlert("Logged In Successfully")
        setupUI()
    }).catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
    }).finally(() => {
        toggleLoader(false)
    })
}

function registerBtnClicked() {
    const name = document.getElementById('register-name-input').value
    const username = document.getElementById('register-username-input').value
    const password = document.getElementById('register-password-input').value
    const image = document.getElementById("register-image-input").files[0]



    let formData = new FormData()
    formData.append("name", name)
    formData.append("username", username)
    formData.append("password", password)
    formData.append("image", image)

    const headers = {
        "Content-Type": "multipart/form-data"
    } 

    const url = `${baseUrl}/register`

    axios.post(url, formData, {
        headers: headers
    })
    .then(function (response) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        const model = document.getElementById("register-modal")
        const modalInnstance = bootstrap.Modal.getInstance(model)
        modalInnstance.hide()

        showAlert("New User Registered Successfully", 'success')
        setupUI()
        
    }).catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
    }).finally(() => {
        toggleLoader(false)
    })
}

function logout() {

    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("Logged out Successfully", "success")
    setupUI()
}

function getCurrentUser() {
    let user = null
    const storageUser = localStorage.getItem("user")

    if (storageUser != null) {
        user = JSON.parse(storageUser)
    }

    return user
}

setupUI()

let currentPage = 1
let lastPage = 1

// ===== INFINITE SCROLL ========= //

function scroll() {

    window.addEventListener("scroll", function () {

        const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
    
        if (endOfPage && currentPage < lastPage) {
    
            currentPage = currentPage + 1
            getPosts(false, currentPage)
        }
    
    });
}


// =====// INFINITE SCROLL //========= //

getPosts()
scroll()

function toggleLoader(show = true) {
    if (show == true) {
        document.getElementById("loader-page").style.visibility = "visible"
    } else {
        document.getElementById("loader-page").style.visibility = "hidden"
    }
}

function userClicked(userId) {

    window.location = `profile.html?userid=${userId}`
}

function profileClicked() {

    const user = getCurrentUser()
    const userId = user.id
    window.location = `profile.html?userid=${userId}`
}

function getPosts(reload = true, page = 1) {
    toggleLoader(true)
    axios.get(`${baseUrl}/posts?limit=10&page=${page}`)
    .then((response) => {
        toggleLoader(false)  
      const posts = response.data.data
      lastPage = response.data.meta.last_page
  
      if (reload) {
        document.getElementById('posts').innerHTML = ""
      }
  
      for  (post of posts) {
  
          const author = post.author
          let postTitle = ""

          // Show or hide edit button
          let user = getCurrentUser()
          let isMyPost = user!= null && post.author.id == user.id
          let editBtnContent = ``
          
          if (isMyPost) {
            editBtnContent = `
            
            <button class="btn btn-danger" style="float: right; margin-left: 5px;" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">
            delete
            </button>

            <button class="btn btn-secondary" style="float: right;" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">
            edit
            </button>
            `
          }

          if (post.title != null) {
              
              postTitle = post.title
          }
  
          let content = `
            <div>
                <div class="card shadow">
                      <div class="card-header">
                          <span style="cursor: pointer;" onclick="userClicked(${author.id})">
                          <img class="img-size rounded-circle border border-3" src="${author.profile_image}" alt="">
                          <b>${author.username}</b>
                          </span>
                          

                          ${editBtnContent}
                          
                      </div>
                      <div class="card-body" id="card-body" onclick="postClicked(${post.id})">
                      <img class="w-100" src="${post.image}" alt="">
  
                      <h6 class="mt-2">
                          ${post.created_at}
                      </h6>
  
                      <h5>${postTitle}</h5>
  
                      <p>
                          ${post.body}
                      </p>
  
                      <hr>
  
                      <div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                          </svg>
                          <span>
                              (${post.comments_count}) Comments
  
                              <span id="post-tags">
                                  
                              </span>
                          </span>
                      </div>
                      </div>
                </div>
            </div>
  
          `
  
          document.getElementById('posts').innerHTML += content
  
          const currentPostTagsId = `post-tags-${post.id}`
          document.getElementById("post-tags").innerHTML = ""
  
          for (tag of post.tags) {
  
              console.log(tag.name)
  
              let tagsContent = `
              <button class="btn btn-sm rounded-5" id="tags">
                      ${post.name}
              </button>
              `
              document.getElementById(currentPostTagsId).innerHTML += tagsContent
          }
      }
    
    })
}

function closeBtnClicked() {
    document.getElementById('post-title-input').value = " "
    document.getElementById('post-body-input').value = " "
}

function addPostButton() {
    closeBtnClicked()
}

function createNewPostClicked() {
    let postId = document.getElementById('post-id-input').value
    let isCreate = postId == null || postId == ""
    const title = document.getElementById('post-title-input').value
    const body = document.getElementById('post-body-input').value
    const image = document.getElementById("post-image-input").files[0]
    const token = localStorage.getItem("token")

    let formData = new FormData()
    formData.append("body", body)
    formData.append("title", title)
    formData.append("image", image)

    let url = ``
    const headers = {
        "authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
    }

    if (isCreate) {
        url = `${baseUrl}/posts`

    } else {

        formData.append("_method", "put")
        url = `${baseUrl}/posts/${postId}`
    }
    toggleLoader(true)
    axios.post(url, formData, {
        headers: headers
    })
    .then(function (response) {

        const model = document.getElementById("create-post-modal")
        const modalInnstance = bootstrap.Modal.getInstance(model)
        modalInnstance.hide()
        getPosts()
        showAlert("New Post Has Been Created", 'success')
    })
    .catch((error) => {
        const message = error.response
        console.log(message);
        showAlert(message, "danger")
    })
    .finally(() => {
        toggleLoader(false)
    })

}


function postClicked(postId) {

  window.location = `postDetails.html?postId=${postId}`
}

function editPostBtnClicked(postObject) {

  let post = JSON.parse(decodeURIComponent(postObject))
  
  document.getElementById("post-model-submit-btn").innerHTML = "Update"
  document.getElementById("post-id-input").value = post.id
  document.getElementById("post-model-title").innerHTML = "Edit Post"
  document.getElementById("post-title-input").value = post.title
  document.getElementById("post-body-input").value = post.body
  
  let postModel = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
  postModel.toggle()
}

function deletePostBtnClicked(postObject) {

    let post = JSON.parse(decodeURIComponent(postObject))
    
    document.getElementById("delete-post-id-input").value = post.id
    let postModel = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
    postModel.toggle()
}

function confirmPostDelete() {
    const postId = document.getElementById("delete-post-id-input").value
    const url = `${baseUrl}/posts/${postId}`
    const token = localStorage.getItem("token")
    const headers = {
        "authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
    }

    axios.delete(url, {
        headers: headers
    })
    .then(function (response) {
        const model = document.getElementById("delete-post-modal")
        const modalInnstance = bootstrap.Modal.getInstance(model)
        modalInnstance.hide()
        showAlert("The Post Has Been Deleted Successfully")
        getPosts()
    })
    .catch((error) => {
        const message = error.response.data.message
        console.log(message);
        showAlert(message, "danger")
    })
}

function addBtnClicked() {

  document.getElementById("post-model-submit-btn").innerHTML = "Create"
  document.getElementById("post-id-input").value = ""
  document.getElementById("post-model-title").innerHTML = "Create A New Post"
  document.getElementById("post-title-input").value = ""
  document.getElementById("post-body-input").value = ""
  
  let postModel = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
  postModel.toggle()
}