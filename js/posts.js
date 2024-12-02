/* posts.js */

document.addEventListener('DOMContentLoaded', () => {
    const createPostButton = document.getElementById('create-post-button');
    const postCards = document.querySelectorAll('.post');
    const postTitles = document.querySelectorAll('.post-title');

    // 게시글 작성 버튼 클릭 시
    createPostButton.addEventListener('click', () => {
        window.location.href = '/posts/new';
    });

    // 포스트 카드(개별 게시글) 클릭 시
    postCards.forEach(post => {
        post.addEventListener('click', () => {
            // 주석 처리: 실제 fetch 이후 활성화 예정
            // const postId = post.dataset.postId;
            window.location.href = `/posts/${postId}`;
        });
    });

    // 제목 글자 수 제한
    postTitles.forEach(title => {
        if (title.textContent.length > 26) {
            title.textContent = title.textContent.slice(0, 26);
        }
    });

    // 게시글 수, 댓글 수, 조회 수 표기
    const updateCount = (element, count) => {
        if (count >= 100000) {
            element.textContent = (count / 1000).toFixed(0) + 'k';
        } else if (count >= 10000) {
            element.textContent = (count / 1000).toFixed(0) + 'k';
        } else if (count >= 1000) {
            element.textContent = (count / 1000).toFixed(1) + 'k';
        } else {
            element.textContent = count;
        }
    }

    // fetch 요청 예시 (주석 처리)
    //fetch('/api/posts') // 실제 API 엔드포인트로 수정
    //    .then(response => {
});
