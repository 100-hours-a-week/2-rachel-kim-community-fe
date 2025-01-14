// make-post.js

document.addEventListener("DOMContentLoaded", () => {
    const backArrow = document.getElementById('back-arrow');
    const profileImg = document.getElementById('profile-img');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const fileInput = document.getElementById('image'); 
    const fileNameElement = document.getElementById('file-name');
    const submitButton = document.getElementById('submit-button');
    const helperText = document.getElementById('helper-text');

    let userId = null;
    let profileImagePath = null;

    // 서버와 통신하여 로그인 상태 확인
    fetch(`${BACKEND_URL}/api/users/auth/check`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
    })
    .then((response) => {
        if (response.status === 403) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        } else if (!response.ok) {
            throw new Error('인증 실패');
        }
        return response.json();
    })
    .then(({ data: { user_id, profile_image_path } }) => {
        userId = user_id;
        if (!userId) {
            console.error('로그인된 사용자 정보가 없습니다.');
            window.location.href = '/posts';
        } 

        profileImagePath = profile_image_path;
        if (profileImagePath) {
            profileImg.src = `${BACKEND_URL}${profileImagePath}`; // 프로필 이미지 업데이트
        }
    })
    .catch(() => {
        console.error('로그인 상태 확인 실패. 로그인 페이지로 리다이렉트합니다.')
        window.location.href = '/login';
    });
    
    // 백애로우 클릭 시
    backArrow.addEventListener('click', () => {
        window.location.href='/posts';
    });

    // 프로필 이미지 클릭 시
    profileImg.addEventListener('click', () => dropdownMenu.classList.toggle('show'));

    // 드롭 다운 메뉴 항목 클릭 시
    dropdownMenu.addEventListener('click', (event) => {
        const { target } = event;
        if (target.tagName === 'A') {
            event.preventDefault(); 
    
            if (target.id === 'profile-link') {
                window.location.href = `/users/${userId}/profile`;  
            } else if (target.id === 'password-link') {
                window.location.href = `/users/${userId}/password`;  
            } else if (target.id === 'logout-link') {
                localStorage.removeItem('authToken'); // JWT 토큰 삭제
                window.location.href = '/login';  
            }
        }
    });

    // 제목 입력 시 
    titleInput.addEventListener('input', () => {
        if (titleInput.value.length > 26) { // 제목 글자 수 제한
            titleInput.value = titleInput.value.slice(0, 26);
        }
        updateSubmitButtonState();
    });

    // 내용 입력 시 
    contentInput.addEventListener('input', () => updateSubmitButtonState());

    // 파일 선택 시
    fileInput.addEventListener('change', ({ target: { files } }) => {
        fileNameElement.textContent = files ? files.name : '파일을 선택해주세요.';
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
        formData.append('postTitle', titleInput.value.trim());
        formData.append('postContent', contentInput.value.trim());
        if (fileInput.files[0]) {
            formData.append('attachFilePath', fileInput.files[0]);
        }

        fetch(`${BACKEND_URL}/api/posts/new`, {
            method: 'POST',
            body: formData, 
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // JWT 토큰
            },
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