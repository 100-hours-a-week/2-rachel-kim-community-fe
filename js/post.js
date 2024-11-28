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

    // 백애로우 클릭 시
    backArrow.addEventListener('click', () => {
        window.location.href = '/posts';
    });

    // 게시글 수정 버튼 클릭 시 
    editPostButton.addEventListener('click', () => {
        // 실제 데이터 fetch 후 활성화 예정
        // const postId = postContainer.dataset.postId;
        window.location.href = `/post/edit/${postId}`;
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
        // 게시글 삭제 요청 (실제 API 호출 필요)
        // fetch(`/api/posts/${postId}`, { method: 'DELETE' })
        closeModal(deletePostModal);
        window.location.href = '/posts'
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

    // 서버에서 게시글 데이터를 fetch로 가져오기
    //fetch('/api/posts') // 실제 API 엔드포인트로 수정
    //    .then(response => {

    // 댓글 입력 상태에 따라 댓글 등록 버튼 활성화
    commentInput.addEventListener('input', () => {
        if (commentInput.value.trim()) {
            submitCommentButton.classList.add('active');
        } else {
            submitCommentButton.classList.remove('active');
        }
    });

    // 댓글 등록/수정 버튼 클릭 시
    let isAdding = true; 
    let currentComment = null; 

    submitCommentButton.addEventListener('click', () => {
        const commentText = commentInput.value.trim();

        if (commentText) {
            if (isAdding) {
                // 댓글 등록 요청 (실제 API 호출 필요)
                // fetch(`/api/posts/${postId}/comments`, 
                // 등록된 댓글 화면에 반영하는 함수 필요
            } else {
                // 댓글 수정 요청 (실제 API 호출 필요)
                //fetch(`/api/comments/${commentId}`, {
                const commentContent = currentComment.querySelector('.comment-content p');
                commentContent.textContent = commentText; 
                isAdding = true; 
                submitCommentButton.textContent = '댓글 등록'; 
                currentComment = null;
            }
            commentInput.value = ''; 
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

            // fetch('/api/comments/123', { method: 'PUT', body: JSON.stringify(mockCommentData), headers: { 'Content-Type': 'application/json' } })
            //     .then(response => response.json())
            //     .then(updatedData => console.log('수정된 댓글:', updatedData));
        }

        // 댓글 삭제 
        if (target.classList.contains('delete-comment-button')) {
            openModal(deleteCommentModal);

            const commentConfirmButton = document.getElementById('comment-confirm-button');

            // 댓글 삭제 모달 확인 버튼 클릭 시
            commentConfirmButton.addEventListener('click', () => {
                const commentBody = target.closest('.comment-actions').previousElementSibling;
                commentBody.remove(); 

                // 댓글 삭제 처리 예시 (mock 데이터 활용)
                // fetch('/api/comments/{commentId}', { method: 'DELETE' })
                //     .then(response => response.json())
                //     .then(() => console.log(`댓글 ${commentId} 삭제됨`));

                closeModal(deleteCommentModal);
            }, { once: true });
        }
    });

    // 댓글 삭제 모달 취소 버튼 클릭 시
    commentCancelButton.addEventListener('click', () => {
        closeModal(deleteCommentModal);
    });

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