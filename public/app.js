// 월별 설정 (필요한 월만 남기고 나머진 지워도 됨)
const TOURNAMENT_CONFIG = {
  "2025-01": { count: 32 },
  // "2025-02": { count: 32 },
  // "2025-03": { count: 32 },
  // ...
};

let currentMonth = "2025-01";
let photos = [];
let currentRound = [];
let nextRound = [];
let index = 0;
let roundSize = 0;

// 배열 셔플
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 선택한 월에 맞춰 사진 URL 배열 만들기
function buildPhotoList(monthKey) {
  const conf = TOURNAMENT_CONFIG[monthKey];
  const list = [];
  for (let i = 1; i <= conf.count; i++) {
    const num = String(i).padStart(2, "0");
    list.push(`./photos/${monthKey}/${num}.jpg`);
  }
  return list;
}

function initTournament(monthKey) {
  currentMonth = monthKey;
  photos = buildPhotoList(monthKey);
  shuffle(photos);

  currentRound = [...photos];
  nextRound = [];
  index = 0;
  roundSize = currentRound.length;

  renderMatch();
  updateStatus();
}

function updateStatus() {
  const status = document.getElementById("status");
  if (currentRound.length > 1) {
    const totalMatches = roundSize / 2;
    const currentMatch = Math.floor(index / 2) + 1;
    status.textContent = `${currentMonth} / ${roundSize}강 ${currentMatch} / ${totalMatches}`;
  } else if (currentRound.length === 1) {
    status.textContent = `${currentMonth} 최종 우승 사진`;
  } else {
    status.textContent = "";
  }
}

function renderMatch() {
  const match = document.getElementById("match");
  const title = document.getElementById("round-title");

  // 라운드 끝났는지 확인
  if (index >= currentRound.length) {
    currentRound = nextRound;
    nextRound = [];
    index = 0;
    roundSize = currentRound.length;

    if (roundSize === 1) {
      title.textContent = `🏆 우승!`;
      match.innerHTML = `
        <div class="card">
          <img src="${currentRound[0]}">
          <div class="card-label">탭해서 다시 시작할 수 있어요</div>
        </div>
      `;
      document.querySelector(".card").onclick = () => initTournament(currentMonth);
      updateStatus();
      return;
    }
  }

  if (currentRound.length < 2) return;

  const a = currentRound[index];
  const b = currentRound[index + 1];

  title.textContent = `${roundSize}강`;

  match.innerHTML = `
    <div class="card" id="left-card">
      <img src="${a}">
      <div class="card-label">왼쪽 선택</div>
    </div>
    <div class="card" id="right-card">
      <img src="${b}">
      <div class="card-label">오른쪽 선택</div>
    </div>
  `;

  document.getElementById("left-card").onclick = () => choose(a);
  document.getElementById("right-card").onclick = () => choose(b);

  updateStatus();
}

function choose(winner) {
  nextRound.push(winner);
  index += 2;
  renderMatch();
}

// 월 선택 셀렉트 박스 초기화
function initMonthSelect() {
  const select = document.getElementById("month-select");
  select.innerHTML = "";

  Object.keys(TOURNAMENT_CONFIG).forEach((monthKey) => {
    const opt = document.createElement("option");
    opt.value = monthKey;
    opt.textContent = monthKey;
    select.appendChild(opt);
  });

  select.value = currentMonth;

  select.onchange = (e) => {
    initTournament(e.target.value);
  };

  const restartBtn = document.getElementById("restart-btn");
  restartBtn.onclick = () => initTournament(currentMonth);
}

document.addEventListener("DOMContentLoaded", () => {
  initMonthSelect();
  initTournament(currentMonth);
});
