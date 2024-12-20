// make-post.js

document.addEventListener("DOMContentLoaded", () => {
    const backArrow = document.getElementById('back-arrow');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const fileInput = document.getElementById('image'); 
    const fileNameElement = document.getElementById('file-name');
    const submitButton = document.getElementById('submit-button');
    const helperText = document.getElementById('helper-text');

    // 백애로우 클릭 시
    backArrow.addEventListener('click', () => {
        window.location.href='/posts';
    });

    // 제목 입력 시 
    titleInput.addEventListener('input', () => {
        // 제목 글자 수 제한
        if (titleInput.value.length > 26) {
            titleInput.value = titleInput.value.slice(0, 26);
        }
        updateSubmitButtonState();
    });

    // 내용 입력 시 
    contentInput.addEventListener('input', () => {
        updateSubmitButtonState();
    });

    // 파일 선택 시
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]; 
        fileNameElement.textContent = file ? file.name : '파일을 선택해주세요.';
    });

    // 완료 버튼 클릭 시
    submitButton.addEventListener('click', () => {
        if (!isFormValid()) {
            helperText.style.display = 'block';
            helperText.textContent = '*제목, 내용을 모두 작성해주세요.';
            return;
        }

        // 서버와 통신하여 게시글 추가 
        const formData = new FormData();
        formData.append('title', titleInput.value.trim());
        formData.append('content', contentInput.value.trim());
        if (file) {
            formData.append('image', fileInput.files[0]);
        }

        fetch('/api/posts', {
            method: 'POST',
            body: formData, 
        })
            .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
            .then(() => {
                window.location.href = '/posts';
            })
            .catch(error => console.error('게시글 작성 실패:', error.message));
    });

    // 유효성 검사 상태 (실질적 유효성, 복잡성 감소)
    function isFormValid() {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        return title && content;
    }

    // 완료 버튼 활성화
    function updateSubmitButtonState() {
        if (isFormValid()) {
            helperText.textContent = '';
            submitButton.disabled = false; 
            submitButton.classList.add('active');
        } else {
            // 질문 - 여기서는 버튼 비활성화 시키면 helpertext 작동이 안됨
            // submitButton.disabled = true;
            submitButton.classList.remove('active');
        }
    }
});