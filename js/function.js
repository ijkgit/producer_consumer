let bufferSize = 0; // 원형 버퍼 크기
let buffer = []; // 원형 버퍼
let inIndex = 0; // 생산자의 인덱스
let outIndex = 0; // 소비자의 인덱스
let mutexP = 1; // 생산자 뮤텍스
let mutexC = 1; // 소비자 뮤텍스
let nrfull = 0; // 버퍼가 가득 찬 횟수
let nrempty = bufferSize; // 버퍼가 비어있는 횟수

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
  if (mutexP === 1 && nrempty !== 0) {
    mutexP = 0;
    logToConsole("Producer mutex locked");
    logToConsole("Producer is producing");

    // 생산자 작업 수행
    const item = Math.floor(Math.random() * 100); // 임의의 값을 생성
    buffer[inIndex] = item;
    inIndex = (inIndex + 1) % bufferSize;
    nrempty--;
    nrfull++;

    logToConsole(`Produced item: ${item}`);
    logToConsole("Producer mutex unlocked");

    setTimeout(() => {
      mutexP = 1;
      logToConsole("Producer mutex re-enabled");
    }, 1000); // 1초 후 생산자 뮤텍스 재활성화
  } else {
    logToConsole("Buffer is full or producer is waiting...");
  }

  updateVariableInfo();
  updateBufferInfo();
}

function consume() {
  if (mutexC === 1 && nrfull !== 0) {
    mutexC = 0;
    logToConsole("Consumer mutex locked");
    logToConsole("Consumer is consuming");

    // 소비자 작업 수행
    const item = buffer[outIndex];
    buffer[outIndex] = undefined;
    outIndex = (outIndex + 1) % bufferSize;
    nrempty++;
    nrfull--;

    logToConsole(`Consumed item: ${item}`);
    logToConsole("Consumer mutex unlocked");

    setTimeout(() => {
      mutexC = 1;
      logToConsole("Consumer mutex re-enabled");
    }, 1000); // 1초 후 소비자 뮤텍스 재활성화
  } else {
    logToConsole("Buffer is empty or consumer is waiting...");
  }

  updateVariableInfo();
  updateBufferInfo();
}

function logToConsole(message) {
  const consoleBox = document.getElementById("console-log");
  consoleBox.innerHTML += `<p>${message}</p>`;
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

function updateBufferInfo() {
  const bufferBox = document.getElementById("buffer-info");
  const items = buffer.map(item => item !== undefined ? item : "-");
  bufferBox.innerHTML = `Buffer: [${items.join(", ")}]`;
}

updateVariableInfo();