/*fe/server.js*/
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 정적 파일 제공 (CSS, 이미지, 폰트, JavaScript 등)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js'))); 

// HTML 파일을 제공하는 경로 설정
app.get('/', (req, res) => {
  res.redirect('/login');  // 기본적으로 로그인 페이지로 리다이렉트
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'log-in.html'));  // 로그인 페이지
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'sign-in.html'));  // 회원가입 페이지
});

app.get('/posts', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'posts.html'));  // 게시글 목록 페이지
});

// new와 :id 순서 중요 (충돌 가능성)
app.get('/posts/new', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'make-post.html'));  // 게시글 작성 페이지
});

app.get('/posts/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'post.html'));  // 게시글 상세 페이지
});

app.get('/posts/:id/edit', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'edit-post.html'));  // 게시글 수정 페이지
});

app.get('/users/:id/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'edit-profile.html'));  // 프로필 수정 페이지
});

app.get('/users/:id/password', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'edit-password.html'));  // 비밀번호 변경 페이지
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중 입니다.`);
});
