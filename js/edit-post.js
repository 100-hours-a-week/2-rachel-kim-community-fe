// edit-post.js

document.addEventListener('DOMContentLoaded', () => {
    const backArrow = document.getElementById('back-arrow');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const helperText = document.getElementById('helper-text');
    const fileInput = document.getElementById('image'); 
    const fileNameElement = document.getElementById('file-name');
    const editButton = document.getElementById('edit-button');

    // 백애로우 클릭 시
    backArrow.addEventListener('click', () => {
        // 실제 데이터 fetch 후 활성화 예정
        // const postId = postContainer.dataset.postId;
        window.location.href = '/posts/{postId}'
    });

    // 제목 입력 시 
    titleInput.addEventListener('input', () => {
        // 제목 글자 수 제한
        if (titleInput.value.length > 26) {
            titleInput.value = titleInput.value.slice(0, 26);
        }
    });

    // 내용 입력 시 
    contentInput.addEventListener('input', () => {
        
    });

    // 파일 선택 시
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]; 
        fileNameElement.textContent = file ? file.name : '파일을 선택해주세요.';
    });

    // 페이지 로드 시, 기존 게시글 데이터 가져오기
    // 제목과 내용은 서버에서 fetch로 받아와야 함
    // 예시:
    // fetch('/api/posts/{postId}')

    // 수정하기 버튼 클릭 시
    editButton.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!title || !content) {
            helperText.style.display = 'block';
            // 질문 - 버튼 클릭하면서 helpertext가 나타나면 결국 업로드 되는 것 아닌가?
            helperText.textContent = '*제목, 내용을 모두 작성해주세요.';
            return;
        } else {
            helperText.textContent = '';
        }

        // 게시글 수정 제출 (fetch로 실제 API 요청 필요)
        // 예시:
        // fetch('/api/posts', {
    });

});