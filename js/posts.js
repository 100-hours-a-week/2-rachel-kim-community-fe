/* posts.js */

document.addEventListener('DOMContentLoaded', () => {
    const createPostButton = document.getElementById('create-post-button');

    // 게시글 작성 버튼 클릭 시
    createPostButton.addEventListener('click', () => {
        window.location.href = '/posts/new';
    });

    // 서버와 통신하여 게시글 목록 조회
    fetch('/api/posts', {
        method: 'GET',
    })
        .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
        .then(data => {
            // 받은 데이터로 게시글 목록 동적 생성
            const postList = document.getElementById('post-list'); 
            
            data.posts.forEach(post => {
                // 각 게시글 요소 생성
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.dataset.postId = post.id; 

                // 포스트 카드(개별 게시글) 클릭 시
                postElement.addEventListener('click', () => {
                    window.location.href = `/posts/${post.id}`;
                });

                // 제목 (글자 수 제한)
                const title = document.createElement('h2');
                title.classList.add('post-title');
                title.textContent = post.title.length > 26 ? post.title.slice(0, 26) : post.title;
               
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
                updateCount(comments, '댓글', post.comments);
                const views = document.createElement('span');
                views.classList.add('views');
                updateCount(views, '조회수', post.views);

                leftGroup.appendChild(likes);
                leftGroup.appendChild(comments);
                leftGroup.appendChild(views);

                const rightGroup = document.createElement('div');
                rightGroup.classList.add('right-group');
                const date = document.createElement('span');
                date.classList.add('date');
                date.textContent = post.date;
                const time = document.createElement('span');
                time.classList.add('time');
                time.textContent = post.time;

                rightGroup.appendChild(date);
                rightGroup.appendChild(time);

                postMeta.appendChild(leftGroup);
                postMeta.appendChild(rightGroup);

                // 작성자 정보
                const authorInfo = document.createElement('div');
                authorInfo.classList.add('author-info');
                const authorPhoto = document.createElement('img');
                authorPhoto.classList.add('author-photo');
                authorPhoto.src = post.authorPhoto;
                authorPhoto.alt = '작성자 프로필 이미지';
                const authorName = document.createElement('span');
                authorName.classList.add('author-name');
                authorName.textContent = post.authorName;

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
            formattedCount
        }
        element.textContent = `${label} ${formattedCount}`;
    }
});

