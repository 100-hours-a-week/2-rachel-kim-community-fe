/* posts.js */

document.addEventListener('DOMContentLoaded', () => {
    const profileImg = document.getElementById('profile-img');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const createPostButton = document.getElementById('create-post-button');
    
    let userId = null;
    let profileImagePath = null;

    // 서버와 통신하여 로그인 상태 확인
    fetch(`${BACKEND_URL}/api/users/auth/status`, {
        method: "GET",
        credentials: 'include', // 쿠키 포함
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // 성공 시 JSON 데이터 반환
        } else if (response.status === 401) {
            window.location.href = "/login"; // 인증 실패 시 로그인 페이지로 이동
        } else {
            throw new Error(`HTTP Error: ${response.status}`);
        }
    })
    .then(({ user }) => {
        userId = user.user_id;
        profileImagePath = user.profile_image_path;
        if (profileImagePath) {
            profileImg.src = `${BACKEND_URL}${profileImagePath}`;
        }
    })
    .catch((error) => {
        console.error('로그인 상태 확인 실패', error);
        window.location.href = '/login';
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

    // 게시글 작성 버튼 클릭 시
    createPostButton.addEventListener('click', () => {
        window.location.href = '/posts/new';
    });
 
    // 서버와 통신하여 게시글 목록 조회
    fetch(`${BACKEND_URL}/api/posts`, {
        method: 'GET',
    })
    .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
    .then(({ data }) => {
        // 받은 데이터로 게시글 목록 동적 생성
        const postList = document.getElementById('post-list'); 
        data.forEach((post) => {
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
    .catch((error) => console.error('게시글 목록 조회 실패:', error)); 

    // 좋이요 수, 댓글 수, 조회 수 표기
    const updateCount = (element, label, count) => {
        const formattedCount =
            count >= 100000 ? `${(count / 1000).toFixed(0)}k` :
            count >= 10000 ? `${(count / 1000).toFixed(0)}k` :
            count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;
        element.textContent = `${label} ${formattedCount}`;
    };
});

