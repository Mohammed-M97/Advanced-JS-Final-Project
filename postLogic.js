const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get("postId")
getPost()


function getPost() {

    axios.get(`${baseUrl}/posts/${id}`)
    .then((response) => {
      const post = response.data.data
      const comments = post.comments
      const author = post.author
      let postTitle = ""
  
          if (post.title != null) {
              
              postTitle = post.title
          }

      document.getElementById("username-span").innerHTML = author.username
      
      let commentsContent = ``

      for (comment of comments) {
        
        commentsContent += `
            <!-- COMMENT -->
            <div class="p-3" style="background-color: rgb(182, 182, 182);">

                <!-- PROFILE PIC + USERNAME -->
                <div>
                    <img src="${comment.author.profile_image}" class="rounded-circle" id="pic-profile" alt="">
                    <b>${comment.author.username}</b>
                </div>
                <!--// PROFILE PIC + USERNAME //-->

                <!-- COMMENT'S BODY -->
                <div>
                    ${comment.body}
                </div>
                <!--// COMMENT'S BODY //-->
            </div>
            <!--// COMMENT //-->

        `
      }
      const postContent = `
        <div class="card shadow">
            <div class="card-header">
                <img class="img-size rounded-circle border border-3" src="${author.profile_image}" alt="">
                <b>${author.username}</b>
            </div>
            <div class="card-body">
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
                    </span>
                </div>
            </div>

            <div id="comments">
                ${commentsContent}
            </div>

            <div class="input-group mb-3" id="add-comment-div">
                <input id="comment-input" class="form-control" placeholder="add your comment here...">
                <button class="btn btn-outline-primary" type="button" onclick="createCommentClicked()">
                send
                </button
            </div>
        </div>
      `

      document.getElementById("post").innerHTML = postContent
    })
}

function createCommentClicked() {
    let commentBody =document.getElementById("comment-input").value
    let params = {
        "body": commentBody
    }
    let token = localStorage.getItem("token")
    let url = `${baseUrl}/posts/${id}/comments`

    axios.post(url, params, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    }).then((response) => {
        showAlert("The comment has been created successfully", "success")
        getPost()
    }).catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
    })

}