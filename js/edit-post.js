// edit-post.js

document.addEventListener('DOMContentLoaded', () => {
    const backArrow = document.getElementById('back-arrow');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const helperText = document.getElementById('helper-text');
    const fileInput = document.getElementById('image'); 
    const fileNameElement = document.getElementById('file-name');
    const editButton = document.getElementById('edit-button');
    const postId = window.location.pathname.split('/')[2];

    // 백애로우 클릭 시
    backArrow.addEventListener('click', () => {
        window.location.href = `/posts/${postId}`
    });

    // 서버와 통신하여 기존 게시글 상세 조회
    fetch(`${BACKEND_URL}/api/posts/${postId}`, {
        method: 'GET'
    })
    .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
    .then(data => {
        const post = data.data;

        titleInput.value = post.post_title;
        contentInput.value = post.post_content;
        fileNameElement.textContent = post.post_image_path ? post.post_image_path.split('/').pop() : '파일을 선택해주세요.';
    })
    .catch(error => {
        console.error('게시글 데이터 로드 오류:', error);
    });

    // 제목 입력 시 
    titleInput.addEventListener('input', () => {
        // 제목 글자 수 제한
        if (titleInput.value.length > 26) {
            titleInput.value = titleInput.value.slice(0, 26);
        }
    });

    // 파일 선택 시
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]; 
        fileNameElement.textContent = file ? file.name : '파일을 선택해주세요.';
    });

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

        // 서버와 통신하여 게시글 수정
        const formData = new FormData();
        formData.append('postTitle', title);
        formData.append('postContent', content);
        
        if (fileInput.files[0]) {
            formData.append('attachFilePath', fileInput.files[0]);
        } else if (fileNameElement.textContent !== '파일을 선택해주세요.') {
            formData.append('existingImagePath', `/public/image/posts/${fileNameElement.textContent}`);
        }

        fetch(`${BACKEND_URL}/api/posts/${postId}`, {
            method: 'PATCH', 
            body: formData, 
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`, // JWT 토큰
            },
        })
            .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
            .then(data => {
                const post = data.data;

                // 제목과 내용을 입력 필드에 설정
                titleInput.value = post.post_title;
                contentInput.value = post.post_content;

                // 이미지 파일명 표시
                fileNameElement.textContent = post.original_file_name || '파일을 선택해주세요.';  
                window.location.href = `/posts/${postId}`;
            })
            .catch(error => {
                console.error('게시글 수정 실패:', error.message);
            });
    });
});