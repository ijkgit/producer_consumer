let bufferSize = 0; // 원형 버퍼 크기
let buffer = []; // 원형 버퍼
let inIndex = 0; // 생산자의 인덱스
let outIndex = 0; // 소비자의 인덱스
let mutexP = 1; // 생산자 뮤텍스
let mutexC = 1; // 소비자 뮤텍스
let nrfull = 0; // 버퍼가 가득 찬 횟수
let nrempty = bufferSize; // 버퍼가 비어있는 횟수
const MAX_LOG_LINES = 2; // 최대 표시할 로그 줄 수
const logLines = []; // 로그 줄을 저장할 배열

setInterval(() => {
  // 상태 확인 및 업데이트하는 코드 작성
  updateVariableInfo();
  updateBufferInfo();
}, 100); // 1초마다 실행

function startProducerConsumer() {
  bufferSize = parseInt(document.getElementById("buffer-size").value);
  buffer = new Array(bufferSize).fill(undefined);
  nrempty = bufferSize;
  nrfull = 0;
  inIndex = 0;
  outIndex = 0;
  updateVariableInfo();
  updateBufferInfo();
}

function updateVariableInfo() {
  document.getElementById("buffer-info").innerText = `Buffer: [${buffer.map(item => item !== undefined ? item : "-").join(", ")}]`;
  document.getElementById("in-info").innerText = `In Index: ${inIndex}`;
  document.getElementById("out-info").innerText = `Out Index: ${outIndex}`;
  document.getElementById("mutexP-info").innerText = `MutexP: ${mutexP}`;
  document.getElementById("mutexC-info").innerText = `MutexC: ${mutexC}`;
  document.getElementById("nrfull-info").innerText = `Nrfull: ${nrfull}`;
  document.getElementById("nrempty-info").innerText = `Nrempty: ${nrempty}`;
}

function produce() {
  if (mutexC === 1 && mutexP === 1 && nrempty !== 0) {
    mutexP = 0;
    logToConsole("Producer mutex locked");
    logToConsole("Producer is producing..");

    // 생산자 작업 수행
    const item = Math.floor(Math.random() * 100); // 임의의 값을 생성
    buffer[inIndex] = item;
    inIndex = (inIndex + 1) % bufferSize;
    nrempty--;
    nrfull++;

    setTimeout(() => {
      mutexP = 1;
      logToConsole("Producer mutex unlocked");
      logToConsole("Producer mutex re-enabled");
    }, 2000); // 1초 후 생산자 뮤텍스 재활성화
  } else if(mutexP == 0) {
    logToConsole("Producer is producing.. You should wait to produce!");
  } else if(mutexC == 0) {
    logToConsole("Consumer is consuming.. You should wait to produce!");
  } else {
    logToConsole("Buffer is full.. You should wait to produce!");
  }

  updateVariableInfo();
  updateBufferInfo();
}



function consume() {
  if (mutexP === 1 && mutexC === 1 && nrfull !== 0) {
    mutexC = 0;
    logToConsole("Consumer mutex locked");
    logToConsole("Consumer is consuming..");

    // 소비자 작업 수행
    const item = buffer[outIndex];
    buffer[outIndex] = undefined;
    outIndex = (outIndex + 1) % bufferSize;
    nrempty++;
    nrfull--;

    setTimeout(() => {
      mutexC = 1;
      logToConsole("Consumer mutex unlocked");
      logToConsole("Consumer mutex re-enabled");
    }, 2000); // 1초 후 소비자 뮤텍스 재활성화
  } else if(mutexP == 0) {
    logToConsole("Producer is producing.. You should wait to consume!");
  } else if(mutexC == 0) {
    logToConsole("Consumer is consuming.. You should wait to consume!");
  } else {
    logToConsole("Buffer is full.. You should wait to consume!");
  }

  updateVariableInfo();
  updateBufferInfo();
}

function logToConsole(message) {
  logLines.push(message); // 로그 줄 추가

  // 최대 표시할 로그 줄 수를 초과하면 첫 번째 줄 삭제
  if (logLines.length > MAX_LOG_LINES) {
    logLines.shift();
  }

  const logElement = document.getElementById("log");
  logElement.innerHTML = ""; // 로그 요소 초기화

  // 로그 줄을 HTML 요소로 변환하여 로그 요소에 추가
  for (const line of logLines) {
    const entryElement = document.createElement("p");
    entryElement.textContent = line;
    entryElement.classList.add("log-entry");
    logElement.appendChild(entryElement);
  }

  // 모든 로그 요소에 fadeOut 애니메이션 효과 적용
  const logEntries = document.getElementsByClassName("log-entry");
  for (const entry of logEntries) {
    entry.style.animationName = "fadeOut";
  }

  // setTimeout(function() {
  //   logElement.innerHTML = ""; // 로그 요소 삭제
  // }, 2000); // 2초 후에 로그를 삭제
}

function updateBufferInfo() {
  const bufferBox = document.getElementById("buffer-info");
  const items = buffer.map(item => item !== undefined ? item : "-");
  bufferBox.innerHTML = `Buffer: [${items.join(", ")}]`;
}

updateVariableInfo();