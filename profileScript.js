getUser()
getPosts()

function getCurrentUserId() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("userid")
    return id
}

function getUser() {

    const id = getCurrentUserId()
    axios.get(`${baseUrl}/users/${id}`)
    .then((response) => {
        const user = response.data.data
        document.getElementById("main-info-email").innerHTML = user.email
        document.getElementById("main-info-name").innerHTML = user.name
        document.getElementById("main-info-post-name").innerHTML = user.name
        document.getElementById("main-info-username").innerHTML = user.username
        document.getElementById("main-info-image").src = user.profile_image

        // POSTS & COMMENTS COUNT

        document.getElementById("posts-count").innerHTML = user.posts_count
        document.getElementById("comments-count").innerHTML = user.comments_count
        getPosts()
    })
    .catch((error) => {
        const message = error.response.data.message
        console.log(message);
        // showAlert(message, "danger")
    })
}

function getPosts() {
    const id = getCurrentUserId()
    axios.get(`${baseUrl}/users/${id}/posts`)
    .then((response) => {
      const posts = response.data.data
  
      document.getElementById("user-posts").innerHTML = ""
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
                          <img class="img-size rounded-circle border border-3" src="${author.profile_image}" alt="">
                          <b>${author.username}</b>

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
  
          document.getElementById('user-posts').innerHTML += content
  
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
