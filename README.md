# 법인 운영의 기술 - 랜딩페이지

2026년 1월 13일 라이브 강의 사전 신청 랜딩페이지

## 프로젝트 구조

```
owners_landing/
├── index.html      # 메인 페이지
├── style.css       # 스타일시트
├── script.js       # 폼 처리 스크립트
├── images/         # 이미지 폴더
│   ├── 01.png
│   ├── 02.png
│   ├── ...
│   └── 10.png
└── README.md
```

## 설정 방법

### 1. 이미지 추가

`images/` 폴더에 제공받은 이미지들을 `01.png` ~ `10.png` 파일명으로 저장하세요.

### 2. Google Sheets 연동 설정

#### Step 1: Google 스프레드시트 생성
1. [Google Sheets](https://sheets.google.com)에서 새 스프레드시트 생성
2. 첫 번째 행에 헤더 추가:
   - A1: `회사명`
   - B1: `대표자명`
   - C1: `연락처`
   - D1: `신청일시`

#### Step 2: Apps Script 설정
1. 스프레드시트에서 `확장 프로그램` > `Apps Script` 클릭
2. 기존 코드를 삭제하고 아래 코드 붙여넣기:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.companyName,
      data.ceoName,
      data.phone,
      data.timestamp
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. `배포` > `새 배포` 클릭
4. 유형: `웹 앱` 선택
5. 설정:
   - 설명: `랜딩페이지 폼`
   - 실행 주체: `나`
   - 액세스 권한: `모든 사용자`
6. `배포` 클릭 후 URL 복사

#### Step 3: 스크립트에 URL 적용
`script.js` 파일의 첫 번째 줄을 수정:

```javascript
const GOOGLE_SHEET_URL = '복사한_웹앱_URL';
```

## 배포 방법

### Vercel (추천)

1. [Vercel](https://vercel.com) 가입/로그인
2. GitHub에 이 프로젝트 푸시
3. Vercel에서 `New Project` > GitHub 저장소 선택
4. `Deploy` 클릭
5. 완료! 자동으로 URL 생성됨

### Netlify

1. [Netlify](https://netlify.com) 가입/로그인
2. `Sites` > `Add new site` > `Deploy manually`
3. 프로젝트 폴더를 드래그 앤 드롭
4. 완료!

### GitHub Pages

1. GitHub에 저장소 생성
2. 프로젝트 파일 푸시
3. `Settings` > `Pages`
4. Branch: `main`, Folder: `/ (root)` 선택
5. `Save` 클릭

## 커스텀 도메인 연결 (선택)

각 호스팅 서비스의 설정에서 커스텀 도메인 추가 가능:
- Vercel: `Settings` > `Domains`
- Netlify: `Domain settings` > `Add custom domain`
- GitHub Pages: `Settings` > `Pages` > `Custom domain`

## 문의 이메일 수정

`index.html` 하단의 footer에서 이메일 주소를 수정하세요:

```html
<p>문의: your-email@example.com</p>
```
