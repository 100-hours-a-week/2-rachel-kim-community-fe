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
    
    // 현재 URL에서 postId 추출
    const urlSegments = window.location.pathname.split('/');
    const postId = urlSegments[urlSegments.length - 1];

    // 로그인한 유저 정보 가져오기
    const currentUserId = getLoggedInUserId();  
    if (currentUserId) {
        fetchComments();  // 댓글을 불러올 때 로그인한 유저 정보 기반으로 수정/삭제 버튼을 처리하기 위해
    } else {
        console.error('로그인된 사용자 정보가 없습니다.');
    }

    // 백애로우 클릭 시
    backArrow.addEventListener('click', () => {
        window.location.href = '/posts';
    });

    // 게시글 수정 버튼 클릭 시 
    editPostButton.addEventListener('click', () => {
        window.location.href = `/post/${postId}/edit`;
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
        fetch(`/api/posts/${postId}`, { 
            method: 'DELETE' 
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
    fetch(`/api/posts/${postId}`, {
        method: 'GET'
    })
        .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
        .then(data => {
            // 게시글 제목, 본문, 작성자, 게시일 등을 HTML 요소에 반영
            const title = document.getElementById('title');
            const postContent = document.querySelector('.post-content p');
            const postImage = document.querySelector('.post-image img');
            const authorName = document.getElementById('author-name');
            const postDate = document.getElementById('post-date');
            const postTime = document.getElementById('post-time');
            
            // 게시글 데이터 업데이트
            title.textContent = data.title;
            postContent.textContent = data.content;
            postImage.src = data.imageUrl; 
            authorName.textContent = data.author.name; 
            postDate.textContent = new Date(data.createdAt).toLocaleDateString(); 
            postTime.textContent = new Date(data.createdAt).toLocaleTimeString(); 

            // 조회 수와 댓글 수 업데이트
            const viewCount = document.getElementById('view-count');
            const commentCount = document.getElementById('comment-count');
            updateCount(viewCount, data.views);
            updateCount(commentCount, data.comments.length);
        })
        .catch(error => console.error('게시글 데이터 로드 오류:', error));

    // 서버와 통신하여 댓글 목록 조회
    const fetchComments = () => {
        commentContainer.innerHTML = ''; 
        fetch(`/api/posts/${postId}/comments`, {
                method: 'GET'
        })
            .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
            .then(comments => {
                comments.forEach(comment => {
                    const commentElement = document.createElement('div');
                    commentElement.classList.add('comment');
                    commentElement.dataset.commentId = comment.id;

                    const commentBody = document.createElement('div');
                    commentBody.classList.add('comment-body');

                    const commentContent = document.createElement('div');
                    commentContent.classList.add('comment-content');
                    const commentText = document.createElement('p');
                    commentText.textContent = comment.content;
                    commentContent.appendChild(commentText);

                    const commentActions = document.createElement('div');
                    commentActions.classList.add('comment-actions');
                    
                    // 댓글 작성자 ID가 로그인한 유저의 ID와 동일한지 확인
                    if (comment.userId === currentUserId) {
                        const editButton = document.createElement('button');
                        editButton.classList.add('edit-comment-button');
                        editButton.textContent = '수정';
                        const deleteButton = document.createElement('button');
                        deleteButton.classList.add('delete-comment-button');
                        deleteButton.textContent = '삭제';
                        commentActions.appendChild(editButton);
                        commentActions.appendChild(deleteButton);
                    }

                    commentBody.appendChild(commentContent);
                    commentBody.appendChild(commentActions);
                    commentElement.appendChild(commentBody);
                    commentContainer.appendChild(commentElement);
                });
            })
            .catch(error => console.error('댓글 목록 로드 오류:', error));
    };
    // 댓글 초기 로드
    fetchComments();

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
                fetch(`/api/posts/${postId}/comments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: commentText })
                })
                    .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
                    .then(() => {
                        commentInput.value = '';
                        fetchComments(); 
                    })
                    .catch(error => console.error('댓글 등록 오류:', error));
            } else {
                // 서버와 통신하여 댓글 수정 
                fetch(`/api/posts/${postId}/comments/${currentComment.dataset.commentId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: commentText })
                })
                    .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
                    .then(() => {
                        commentInput.value = '';
                        isAdding = true;
                        submitCommentButton.textContent = '댓글 등록';
                        currentComment = null;
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
            currentComment = commentBody; 
        }

        // 댓글 삭제 
        if (target.classList.contains('delete-comment-button')) {
            openModal(deleteCommentModal);
            const commentConfirmButton = document.getElementById('comment-confirm-button');

            // 댓글 삭제 모달 확인 버튼 클릭 시
            commentConfirmButton.addEventListener('click', () => {
                // 서버와 통신하여 댓글 삭제
                const commentId = target.closest('.comment').dataset.commentId;
                fetch(`/api/posts/${postId}comments/${commentId}`, { 
                    method: 'DELETE' 
                })
                    .then(response => response.json())
                    .then(() => {
                        closeModal(deleteCommentModal); 
                        fetchComments(); 
                    })
                    .catch(error => console.error('댓글 삭제 오류:', error));       
            }, { once: true });
        }
    });

    // 댓글 삭제 모달 취소 버튼 클릭 시
    commentCancelButton.addEventListener('click', () => {
        closeModal(deleteCommentModal);
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

     // JWT 디코딩 함수
    function decodeJWT(token) {
        // JWT 토큰을 디코딩하여 유저 정보를 추출하는 함수
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const decoded = JSON.parse(window.atob(base64));
        return decoded;
    }

    // 로그인된 사용자의 ID를 JWT 토큰에서 추출하는 함수
    function getLoggedInUserId() {
        const token = localStorage.getItem('authToken');  // JWT 토큰을 localStorage에서 가져옴
        if (token) {
            const decodedToken = decodeJWT(token);  // JWT 디코딩
            return decodedToken.userId;  // 디코딩된 토큰에서 userId를 반환
        }
        return null;  // 토큰이 없으면 null 반환
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