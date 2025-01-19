// edit-post.js

document.addEventListener('DOMContentLoaded', () => {
    const backArrow = document.getElementById('back-arrow');
    const profileImg = document.getElementById('profile-img');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const helperText = document.getElementById('helper-text');
    const fileInput = document.getElementById('image'); 
    const fileNameElement = document.getElementById('file-name');
    const editButton = document.getElementById('edit-button');
    const postId = window.location.pathname.split('/')[2];

    let userId = null;

    // 서버와 통신하여 인증된 사용자 확인
    fetch(`${BACKEND_URL}/api/users/protected`, {
        method: "GET",
        credentials: "include", // 세션 쿠키 포함
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // 인증된 사용자 정보 반환
        } else {
            throw new Error('인증되지 않은 사용자입니다.');
        }
    })
    .then(({ user }) => {
        userId = user.user_id;
        if (user.profile_image_path) {
            profileImg.src = `${BACKEND_URL}${user.profile_image_path}`; // 프로필 이미지 업데이트
        }
    })
    .catch(error => {
        console.error('사용자 인증 실패:', error.message);
        window.location.href = '/login'; // 인증 실패 시 로그인 페이지로 리다이렉트
    });

    // 프로필 이미지 클릭 시
    profileImg.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });

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
                // 서버와 통신하여 로그아웃
                fetch(`${BACKEND_URL}/api/users/logout`, {
                    method: 'POST',
                    credentials: 'include', // 세션 쿠키 포함
                })
                .then(response => {
                    if (response.ok) {
                        window.location.href = '/login'; // 로그아웃 성공 후 리다이렉트
                    }
                })
                .catch(error => console.error(`로그아웃 실패: ${error}`));
            }
        }
    });
    
    // 백애로우 클릭 시
    backArrow.addEventListener('click', () => {
        window.location.href = `/posts/${postId}`
    });

    // 서버와 통신하여 기존 게시글 상세 조회
    fetch(`${BACKEND_URL}/api/posts/${postId}`, {
        method: 'GET'
    })
    .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
    .then(({ data: post }) => {
        titleInput.value = post.post_title;
        contentInput.value = post.post_content;
        fileNameElement.textContent = post.post_image_path ? post.post_image_path.split('/').pop() : '파일을 선택해주세요.';
    })
    .catch(error => {
        console.error('게시글 데이터 로드 오류:', error);
    });

    // 제목 입력 시 
    titleInput.addEventListener('input', () => {
        if (titleInput.value.length > 26) { // 제목 글자 수 제한
            titleInput.value = titleInput.value.slice(0, 26);
        }
    });

    // 파일 선택 시
    fileInput.addEventListener('change', ({ target: { files } }) => {
        fileNameElement.textContent = files[0] ? files[0].name : '파일을 선택해주세요.';
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
            credentials: 'include', // 쿠키 포함
        })
        .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
        .then(({ data: post }) => {
            titleInput.value = post.post_title; // 제목과 내용을 입력 필드에 설정
            contentInput.value = post.post_content;
            fileNameElement.textContent = post.original_file_name || '파일을 선택해주세요.';  // 이미지 파일명 표시
            window.location.href = `/posts/${postId}`;
        })
        .catch(error => {
            console.error('게시글 수정 실패:', error.message);
        });
    });
});