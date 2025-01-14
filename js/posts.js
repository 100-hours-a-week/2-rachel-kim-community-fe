/* posts.js */

document.addEventListener('DOMContentLoaded', () => {
    const profileImg = document.getElementById('profile-img');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const createPostButton = document.getElementById('create-post-button');
    
    let userId = null;
    let profileImagePath = null;

    // 서버와 통신하여 로그인 상태 확인
    fetch(`${BACKEND_URL}/api/users/auth/check`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
    })
    .then(response => {
        if (response.status === 403) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        } else if (!response.ok) {
            throw new Error('인증 실패');
        }
        return response.json();
    })
    .then(authData => {
        userId = authData.data.user_id; 
        profileImagePath = authData.data.profile_image_path;
        // 프로필 이미지 업데이트
        if (profileImagePath) {
            profileImg.src = `${BACKEND_URL}${profileImagePath}`;
        }
    })
    .catch(() => {
        console.error('로그인 상태 확인 실패. 로그인 페이지로 리다이렉트합니다.');
        window.location.href = '/login';
    });

    // 프로필 이미지 클릭 시
    profileImg.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });

    // 드롭 다운 메뉴 항목 클릭 시
    dropdownMenu.addEventListener('click', (event) => {
        const target = event.target;
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

    // 게시글 작성 버튼 클릭 시
    createPostButton.addEventListener('click', () => {
        window.location.href = '/posts/new';
    });
 
    // 서버와 통신하여 게시글 목록 조회
    fetch(`${BACKEND_URL}/api/posts`, {
        method: 'GET',
    })
        .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
        .then(data => {
            // 받은 데이터로 게시글 목록 동적 생성
            const postList = document.getElementById('post-list'); 
            data.data.forEach(post => {
                // 각 게시글 요소 생성
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.dataset.postId = post.post_id; 

                // 포스트 카드(개별 게시글) 클릭 시
                postElement.addEventListener('click', () => {
                    window.location.href = `/posts/${post.post_id}`;
                });

                // 제목 (글자 수 제한)
                const title = document.createElement('h2');
                title.classList.add('post-title');
                title.textContent = post.post_title.length > 26 ? post.post_title.slice(0, 26) : post.post_title;
               
                // 메타 정보 (좋아요, 댓글, 조회수, 날짜, 시간)
                const postMeta = document.createElement('div');
                postMeta.classList.add('post-meta');

                const leftGroup = document.createElement('div');
                leftGroup.classList.add('left-group');
                const likes = document.createElement('span');
                likes.classList.add('likes');
                updateCount(likes, '좋아요', post.likes);
                const comments = document.createElement('span');
                comments.classList.add('comments');
                updateCount(comments, '댓글', post.comment_count);
                const views = document.createElement('span');
                views.classList.add('views');
                updateCount(views, '조회수', post.views);

                leftGroup.appendChild(likes);
                leftGroup.appendChild(comments);
                leftGroup.appendChild(views);

                const rightGroup = document.createElement('div');
                rightGroup.classList.add('right-group');
                const createdAt = new Date(post.created_at);
                const date = createdAt.toISOString().split('T')[0]; // 'YYYY-MM-DD'
                const time = createdAt.toTimeString().split(' ')[0]; // 'HH:mm:ss'

                const dateElement = document.createElement('span');
                dateElement.classList.add('date');
                dateElement.textContent = date;
                const timeElement = document.createElement('span');
                timeElement.classList.add('time');
                timeElement.textContent = time;

                rightGroup.appendChild(dateElement);
                rightGroup.appendChild(timeElement);

                postMeta.appendChild(leftGroup);
                postMeta.appendChild(rightGroup);

                // 작성자 정보
                const authorInfo = document.createElement('div');
                authorInfo.classList.add('author-info');
                const authorPhoto = document.createElement('img');
                authorPhoto.classList.add('author-photo');
                authorPhoto.src = `${BACKEND_URL}${post.profile_image_path}`;
                authorPhoto.alt = '작성자 프로필 이미지';
                const authorName = document.createElement('span');
                authorName.classList.add('author-name');
                authorName.textContent = post.nickname;

                authorInfo.appendChild(authorPhoto);
                authorInfo.appendChild(authorName);

                // 게시글 내용 구성
                postElement.appendChild(title);
                postElement.appendChild(postMeta);
                postElement.appendChild(document.createElement('hr')); // 구분선
                postElement.appendChild(authorInfo);

                // 게시글을 postList에 추가
                postList.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('게시글 목록 조회 실패:', error);
        });

    function decodeJWT(token) {
        // JWT 토큰을 디코딩하여 유저 정보를 추출하는 함수
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const decoded = JSON.parse(window.atob(base64));
        return decoded;
    }

    // 로그인된 사용자의 ID를 JWT 토큰에서 추출하는 함수
    function getLoggedInUserId() {
        const token = localStorage.getItem('authToken'); 
        if (token) {
            const decodedToken = decodeJWT(token);  
            return decodedToken?.user_id; 
        }
        console.error('JWT 토큰이 없거나 유효하지 않습니다.');
        return null;  
    }

    // 좋이요 수, 댓글 수, 조회 수 표기
    const updateCount = (element, label, count) => {
        let formattedCount;
        if (count >= 100000) {
            formattedCount = (count / 1000).toFixed(0) + 'k';
        } else if (count >= 10000) {
            formattedCount = (count / 1000).toFixed(0) + 'k';
        } else if (count >= 1000) {
            formattedCount = (count / 1000).toFixed(1) + 'k';
        } else {
            formattedCount = count;
        }
        element.textContent = `${label} ${formattedCount}`;
    }
});

