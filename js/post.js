/* post.js */
document.addEventListener('DOMContentLoaded', () => {
    const backArrow = document.getElementById('back-arrow');
    const editPostButton = document.getElementById('edit-post-button');
    const deletePostButton = document.getElementById('delete-post-button');
    const deletePostModal = document.getElementById('delete-post-modal');
    const postCancelButton = document.getElementById('post-cancel-button');
    const postConfirmButton = document.getElementById('post-confirm-button');
    const commentInput = document.getElementById('comment-input');
    const submitCommentButton = document.getElementById('submit-comment-button');
    const commentContainer = document.querySelector('.comment-container');
    const deleteCommentModal = document.getElementById('delete-comment-modal');
    const commentCancelButton = document.getElementById('comment-cancel-button');
    const urlSegments = window.location.pathname.split('/');
    const postId = urlSegments[urlSegments.length - 1];
    const currentUserId = getLoggedInUserId(); 

    // 백애로우 클릭 시
    backArrow.addEventListener('click', () => {
        window.location.href = '/posts';
    });

    // 게시글 수정 버튼 클릭 시 
    editPostButton.addEventListener('click', () => {
        window.location.href = `/posts/${postId}/edit`;
    });

    // 게시글 삭제 버튼 클릭 시
    deletePostButton.addEventListener('click', () => {
        openModal(deletePostModal);
    });

    // 게시글 삭제 모달 취소 버튼 클릭 시
    postCancelButton.addEventListener('click', () => {
        closeModal(deletePostModal);
    });

    // 게시글 삭제 모달 확인 버튼 클릭 시
    postConfirmButton.addEventListener('click', () => {
        // 서버와 통신하여 게시글 삭제 
        fetch(`${BACKEND_URL}/api/posts/${postId}`, { 
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`, 
            } 
        })
            .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
            .then(() => {
                closeModal(deletePostModal);
                window.location.href = '/posts';
            })
            .catch(error => {
                console.error('게시글 삭제 오류:', error)
            });
    });

    // 서버와 통신하여 게시글 상세 조회
    fetch(`${BACKEND_URL}/api/posts/${postId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
    })
        .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
        .then(responseData => {
            const post = responseData.data;

            // 게시글 제목, 본문, 작성자, 게시일 등을 HTML 요소에 반영
            const title = document.getElementById('title');
            const authorPhoto = document.getElementById('author-photo')
            const authorName = document.getElementById('author-name');
            const postDate = document.getElementById('post-date');
            const postTime = document.getElementById('post-time');
            const postContent = document.querySelector('.post-content p');
            const postImage = document.querySelector('.post-image img');

            // 게시글 데이터 업데이트
            title.textContent = post.post_title;
            authorPhoto.src = `${BACKEND_URL}${post.profile_image_path}`; 
            authorName.textContent = post.nickname; 
            postDate.textContent = new Date(post.created_at).toLocaleDateString(); 
            postTime.textContent = new Date(post.created_at).toLocaleTimeString(); 
            postContent.textContent = post.post_content;
            postImage.src = `${BACKEND_URL}${post.post_image_path}`; 

            // 게시글 작성자와 로그인 사용자가 다르면 수정/삭제 버튼 숨기기
            if (post.user_id !== currentUserId) {
                editPostButton.style.display = 'none';
                deletePostButton.style.display = 'none';
            }

            // 좋아요수, 조회 수, 댓글 수 업데이트
            const likeCount = document.getElementById('like-count');
            const viewCount = document.getElementById('view-count');
            const commentCount = document.getElementById('comment-count');
            updateCount(likeCount, post.likes);
            updateCount(viewCount, post.views);
            updateCount(commentCount, post.comment_count);
        })
        .catch(error => console.error('게시글 데이터 로드 오류:', error));

    // 서버와 통신하여 댓글 목록 조회
    const fetchComments = () => {
        commentContainer.innerHTML = ''; 
        fetch(`${BACKEND_URL}/api/posts/${postId}/comments`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
            .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
            .then(responseData => {
                const comments = responseData.data;
                console.log("서버에서 가져온 댓글 데이터:", comments);
                commentContainer.innerHTML = '';
                
                comments.forEach(comment => {
                    console.log("댓글의 user_id:", comment.user_id);

                    const commentElement = document.createElement('div');
                    commentElement.classList.add('comment-container');
                    commentElement.dataset.commentId = comment.comment_id;

                    const commentBody = document.createElement('div');
                    commentBody.classList.add('comment-body');

                    const commentMetaContent = document.createElement('div');
                    commentMetaContent.classList.add('comment-meta-content');

                    const commentMeta = document.createElement('div');
                    commentMeta.classList.add('comment-meta');
                    const commentAuthorPhoto = document.createElement('img');
                    commentAuthorPhoto.src = `${BACKEND_URL}${comment.profile_image_path}`;   
                    commentAuthorPhoto.alt = '댓글 작성자 이미지';
                    commentAuthorPhoto.classList.add('comment-author-photo');
                    const commentAuthorName = document.createElement('span');
                    commentAuthorName.classList.add('comment-author-name');
                    commentAuthorName.textContent = comment.nickname;
                    const commentDate = document.createElement('span');
                    commentDate.classList.add('comment-date');
                    commentDate.textContent = new Date(comment.created_at).toLocaleDateString();
                    const commentTime = document.createElement('span');
                    commentTime.classList.add('comment-time');
                    commentTime.textContent = new Date(comment.created_at).toLocaleTimeString();

                    commentMeta.appendChild(commentAuthorPhoto);
                    commentMeta.appendChild(commentAuthorName);
                    commentMeta.appendChild(commentDate);
                    commentMeta.appendChild(commentTime);

                    const commentContent = document.createElement('div');
                    commentContent.classList.add('comment-content');
                    const commentText = document.createElement('p');
                    commentText.textContent = comment.comment_content;
                    commentContent.appendChild(commentText);

                    commentMetaContent.appendChild(commentMeta);
                    commentMetaContent.appendChild(commentContent);

                    const commentActions = document.createElement('div');
                    commentActions.classList.add('comment-actions');
                    
                    // 댓글 작성자 ID가 로그인한 유저의 ID와 동일한지 확인
                    if (comment.user_id === currentUserId) {
                        const editButton = document.createElement('button');
                        editButton.classList.add('edit-comment-button');
                        editButton.textContent = '수정';
                        const deleteButton = document.createElement('button');
                        deleteButton.classList.add('delete-comment-button');
                        deleteButton.textContent = '삭제';
                        commentActions.appendChild(editButton);
                        commentActions.appendChild(deleteButton);
                    }
                    console.log('로그인한 사용자 ID:', currentUserId);
                    console.log('댓글 작성자 ID', comment.user_id);

                    commentBody.appendChild(commentMetaContent);
                    commentBody.appendChild(commentActions);
                    commentElement.appendChild(commentBody);
                    commentContainer.appendChild(commentElement);
                });
            })
            .catch(error => console.error('댓글 목록 로드 오류:', error));
    };
    // 초기 댓글 목록 (로그인 무관)
    fetchComments();

    if (currentUserId) {
        //로그인 사용자 기반으로 댓글 수정/ 삭제 버튼 업데이트
        fetchComments();  
    } else {
        console.error('로그인된 사용자 정보가 없습니다.');
    }

    // 댓글 등록 버튼 활성화
    commentInput.addEventListener('input', () => {
        if (commentInput.value.trim()) {
            submitCommentButton.classList.add('active');
        } else {
            submitCommentButton.classList.remove('active');
        }
    });
    
    let isAdding = true; 
    let currentComment = null; 
    // 댓글 등록/수정 버튼 클릭 시
    submitCommentButton.addEventListener('click', () => {
        const commentText = commentInput.value.trim();

        if (commentText) {
            if (isAdding) {
                // 서버와 통신하여 댓글 등록 
                fetch(`${BACKEND_URL}/api/posts/${postId}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    body: JSON.stringify({ commentContent: commentText })
                })
                    .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
                    .then(() => {
                        commentInput.value = '';
                        // 등록 댓글 반영
                        fetchComments(); 
                    })
                    .catch(error => console.error('댓글 등록 오류:', error));
            } else {
                // 서버와 통신하여 댓글 수정 
                fetch(`${BACKEND_URL}/api/posts/${postId}/comments/${currentComment.dataset.commentId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    body: JSON.stringify({ commentContent: commentText })
                })
                    .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
                    .then(() => {
                        commentInput.value = '';
                        isAdding = true;
                        submitCommentButton.textContent = '댓글 등록';
                        currentComment = null;
                        // 수정 댓글 반영
                        fetchComments(); 
                    })
                    .catch(error => console.error('댓글 수정 오류:', error));
            }
        }
    });

    //댓글 수정 버튼, 댓글 삭제 버튼 클릭 시 (개별 댓글 내)
    commentContainer.addEventListener('click', (event) => {
        const target = event.target;

        // 댓글 수정 
        if (target.classList.contains('edit-comment-button')) {
            const commentActions = target.closest('.comment-actions');
            const commentBody = commentActions.previousElementSibling;
            const commentContent = commentBody.querySelector('.comment-content p');
            
            commentInput.value = commentContent.textContent;
            submitCommentButton.textContent = '댓글 수정';

            // 수정 모드로 전환
            isAdding = false;
            currentComment = commentActions.closest('.comment-container')
        }

        // 댓글 삭제 
        if (target.classList.contains('delete-comment-button')) {
            openModal(deleteCommentModal);
            const commentId = target.closest('.comment-container').dataset.commentId;
            deleteCommentModal.dataset.commentId = commentId;
        }
    });

    // 댓글 삭제 모달 취소 버튼 클릭 시
    commentCancelButton.addEventListener('click', () => {
        closeModal(deleteCommentModal);
    });

    // 댓글 삭제 모달 확인 클릭
    document.getElementById('comment-confirm-button').addEventListener('click', () => {
        const commentId = deleteCommentModal.dataset.commentId;
        // 서버와 통신하여 댓글 삭제
        fetch(`${BACKEND_URL}/api/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
            .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
            .then(() => {
                closeModal(deleteCommentModal);
                // 삭제 댓글 반영
                fetchComments(); 
            })
            .catch(error => console.error('댓글 삭제 오류:', error));
    });

    // 조회 수, 댓글 수 표기
    const updateCount = (element, count) => {
        if (count >= 100000) {
            element.textContent = `${(count / 1000).toFixed(0)}k`;
        } else if (count >= 10000) {
            element.textContent = `${(count / 1000).toFixed(0)}k`;
        } else if (count >= 1000) {
            element.textContent = `${(count / 1000).toFixed(1)}k`;
        } else {
            element.textContent = count;
        }
    };

    function decodeJWT(token) {
        // JWT 토큰을 디코딩하여 유저 정보를 추출하는 함수
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        try {
            const decoded = JSON.parse(window.atob(base64));
            return decoded;
        } catch (error) {
            console.error('JWT 디코딩 오류:', error);
            return null;
        }
    }

    // 로그인된 사용자의 ID를 JWT 토큰에서 추출하는 함수
    function getLoggedInUserId() {
        const token = localStorage.getItem('authToken'); 
        if (token) {
            const decodedToken = decodeJWT(token);  
            return decodedToken?.user_id;  // JWT에 user_id가 `id` 키에 저장되었는지 확인
        }
        console.error('JWT 토큰이 없거나 유효하지 않습니다.');
        return null;  
    }

    // 모달 열기 함수
    function openModal(modal) {
        const overlay = modal.closest('.overlay');  
        overlay.classList.add('active'); 
        document.body.classList.add('no-scroll'); 
    }

    // 모달 닫기 함수
    function closeModal(modal) {
        const overlay = modal.closest('.overlay'); 
        overlay.classList.remove('active'); 
        document.body.classList.remove('no-scroll');
    }
});