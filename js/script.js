let bufferSize = 0; // 원형 버퍼 크기
let buffer = []; // 원형 버퍼
let inIndex = 0; // 생산자의 인덱스
let outIndex = 0; // 소비자의 인덱스
let mutexP = 1; // 생산자 뮤텍스
let mutexC = 1; // 소비자 뮤텍스
let nrfull = 0; // 버퍼가 가득 찬 횟수
let nrempty = bufferSize; // 버퍼가 비어있는 횟수
let criticalSection = [];
let percent = 0;
const MAX_LOG_LINES = 2; // 최대 표시할 로그 줄 수
const logLines = []; // 로그 줄을 저장할 배열

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

setInterval(() => {
  // 상태 확인 및 업데이트하는 코드 작성
  updateVariableInfo();
  updateBufferInfo();
  updateQueueImage();
}, 1);

function startProducerConsumer() {
  bufferSize = parseInt(document.getElementById("buffer-size").value);
  criticalSection = new Array(bufferSize).fill(undefined);
  buffer = new Array(bufferSize).fill(undefined);
  nrempty = bufferSize;
  nrfull = 0;
  inIndex = 0;
  outIndex = 0;
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

function lockMutexP() {
  mutexP = 0;
  logToConsole("Producer mutex locked");
}

function unlockMutexP() {
  mutexP = 1;
}

function lockMutexC() {
  mutexC = 0;
}

function unlockMutexC() {
  mutexC = 1;
}

function produceProcess() {
  const item = Math.floor(Math.random() * 100); // 임의의 값을 생성
  buffer[inIndex] = item;
  inIndex = (inIndex + 1) % bufferSize;
  nrempty--;
  nrfull++;
  percent = (nrfull/bufferSize)*100;
}

function consumeProcess() {
  const item = buffer[outIndex];
  buffer[outIndex] = undefined;
  outIndex = (outIndex + 1) % bufferSize;
  nrempty++;
  nrfull--;
  percent = (nrfull/bufferSize)*100;
}

async function produce() {
  if (mutexP === 1) {
    lockMutexP();
    await sleep(500);
    if (nrempty !== 0) {
      if (criticalSection[outIndex-1] !== 0) {
        logToConsole("Producer start producing");
        criticalSection[inIndex] = 0;
        produceProcess();
        await sleep(2000);
        criticalSection[inIndex-1] = 1;
        logToConsole("Producer finish producing");
        unlockMutexP();
      } else {
        logToConsole("Consumer is consuming what you want to produce.");
        unlockMutexP();
      }
    } else {
      logToConsole("Buffer is full.");
      unlockMutexP();
    }
  } else {
    logToConsole("Another Producer is producing..");
  }
}

async function consume() {
  if (mutexC === 1) {
    lockMutexC();
    await sleep(500);
    if (nrfull !== 0) {
      if (criticalSection[inIndex-1] !== 0) {
        logToConsole("Consumer start consuming");
        criticalSection[outIndex] = 0;
        consumeProcess();
        await sleep(2000);
        criticalSection[outIndex-1] = 1;
        logToConsole("Consumer finish consuming");
        unlockMutexC();
      } else {
        logToConsole("Producer is producing what you want to consume.");
        unlockMutexC();
      }
    } else {
      logToConsole("Buffer is empty.");
      unlockMutexC();
    }
  } else {
    logToConsole("Another Consumer is consuming");
  }
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

function updateQueueImage() {
    var val = percent;
    var $circle = $('#svg #bar');
    
    if (isNaN(val)) {
     val = 100; 
    }
    else{
      var r = $circle.attr('r');
      var c = Math.PI*(r*2);
     
      if (val < 0) { val = 0;}
      if (val > 100) { val = 100;}
      
      var pct = ((100-val)/100)*c;
      
      $circle.css({ strokeDashoffset: pct});
      
      $('#cont').attr('data-pct',val);
    }
}

// on page load...
moveProgressBar();
// on browser resize...
$(window).resize(function() {
    moveProgressBar();
});

// SIGNATURE PROGRESS
function moveProgressBar() {
  console.log("moveProgressBar");
    var getPercent = (100 / 100);
    var getProgressWrapWidth = $('.progress-wrap').width();
    var progressTotal = getPercent * getProgressWrapWidth;
    var animationLength = 2500;
    
    // on page load, animate percentage bar to data percentage length
    // .stop() used to prevent animation queueing
    $('.progress-bar').stop().animate({
        left: progressTotal
    }, animationLength);
}