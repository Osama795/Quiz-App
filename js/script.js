// Select Elements
let qCategory = document.querySelector(".quiz-info .category span");
let catBtn = document.querySelectorAll(".quiz-cat button");

let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");

let msg = document.querySelector(".quiz-app .alert");

let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

// hide submit button and quiz info until choose th category of questions 
submitButton.style.display = "none";
document.querySelector(".quiz-info").style.display = "none";

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let qObject = JSON.parse(this.responseText);
      let fullqCount =  qObject.length;
      // console.log(fullqCount);
      let qCount = 10;
      // Shuffle Questions
      shuffle(qObject);

      countSpan.innerHTML = qCount;
      // Create Bullets + Set Questions Count
      createBullets(qCount);

      // Add Question Data
      addQuestionData(qObject[currentIndex], qCount);
      // addQuestionData(qObject[currentIndex], qCount);
      // addQuestionData(qObject[currentIndex][1], qCount);
    
      if(localStorage.getItem("bullets_option") == "none") {
        bulletsSpanContainer.style.display = "block";
        // bulletsSpanContainer.style.textAlign = "center";
       bulletsSpanContainer.innerHTML = `${currentIndex + 1} من ${qCount}`;
     }   

      if(localStorage.getItem("time_option") == "block") {
        
        // Start CountDown
         countdown(40, qCount);
     }
   
     // Handle Bullets Class
     handleBullets();
      // Click On Submit
      submitButton.onclick = () => {
         // Get Right Answer
         let theRightAnswer = qObject[currentIndex].right_answer;

         
         // Increase Index
         currentIndex++;
        //  currentIndex = Math.floor(Math.random() * qCount);;
 
         // Check The Answer
         checkAnswer(theRightAnswer, qCount);
 
         // Remove Previous Question
         quizArea.innerHTML = "";
         answersArea.innerHTML = "";
         if(localStorage.getItem("bullets_option") == "none") {
            bulletsSpanContainer.innerHTML = `${currentIndex + 1} من ${qCount}`;
         } 
         // Add Question Data
         addQuestionData(qObject[currentIndex], qCount);
 
         // Handle Bullets Class
         handleBullets();
 
         if(localStorage.getItem("time_option") == "block") {
            // Start CountDown
             clearInterval(countdownInterval);
             countdown(40, qCount);
         }
         
         // Show Results
         showResults(qCount);
 
      };
    }
  };
  
  // buttons to choose category of quistions
  catBtn.forEach((el) => {
    el.onclick = function () {
        qCategory.innerHTML = el.innerHTML;
        myRequest.open("GET",`${el.className}.json`, true);
        myRequest.send();
        submitButton.style.display = "block";
        document.querySelector(".quiz-info").style.display = "flex";
        el.parentElement.remove();
        document.querySelector(".settings-box").remove();
    }    
  });
  // myRequest.open("GET", "islamic_questions.json", true);
  // myRequest.send();
 
}

getQuestions();

function shuffle(arr) {
  // console.log(obj);
  // console.log(count);
  let i = arr.length, 
  j = 0, 
  temp;
  while (i--) {
      j = Math.floor(Math.random() * (i+1));
      // swap randomly chosen element with current element
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
  }
  return arr;
}

function createBullets(num) {
  // countSpan.innerHTML = num;

  // Create Spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("span");
    let theBulletTxt = document.createTextNode(i + 1);
    theBullet.appendChild(theBulletTxt);

    // Check If Its First Span
    if (i === 0) {
      theBullet.className = "on";
    }

    // Append Bullets To Main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 Question Title
    let questionTitle = document.createElement("h2");
    // Create Question Text
    let questionText = document.createTextNode(obj["title"]); // Or document.createTextNode(obj.title);
    // console.log(obj.title);
    // Append Text To H2
    questionTitle.appendChild(questionText);
    quizArea.innerHTML = "";
    // Append The H2 To The Quiz Area
    quizArea.appendChild(questionTitle);
    
    // Make a Shuffle For Answers
    let randAnswers = shuffle(obj["choices"]);

    // Create The Answers
    for (let i = 0; i < obj["choices"].length; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");
      // Add Class To Main Div
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");
      // Add Type + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i + 1}`;
      // radioInput.dataset.answer = obj[`answer_${i}`];
      
      radioInput.dataset.answer = randAnswers[i];
      
      // Make First Option Selected
      // if (i === 0) {
      //   radioInput.checked = true;
      // }
      
      // Create Label
      let theLabel = document.createElement("label");
      // Add For Attribute
      theLabel.htmlFor = `answer_${i + 1}`;
      // Create Label Text
      // let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      // console.log(obj["choices"]);
     
      let theLabelText = document.createTextNode(randAnswers[i]);
      // Add The Text To Label
      theLabel.appendChild(theLabelText);
     
      // Add Input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      // Append All Divs To Answers Area
      answersArea.appendChild(mainDiv);
    }
    
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  // console.log(rAnswer);
  // console.log(theChoosenAnswer);

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
    msg.classList.remove("on");
    msg.classList.add("off");
  } else if(theChoosenAnswer === undefined) {
    currentIndex--;
    msg.classList.remove("off");
    msg.classList.add("on"); 
    submitButton.preventDefault(); 
    // submitButton.onclick = function (event) {
    //   event.preventDefault(); 
    // }
  } else {
    currentIndex = count;
    msg.classList.remove("on");
    msg.classList.add("off");
  }

    
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
      span.classList.add("flashing");
    } else {
      span.classList.remove("flashing");
    }
  });
}

// hide results container
resultsContainer.style.display = "none";
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    countSpan.parentElement.remove();
    document.querySelector(".quiz-info").style.justifyContent =  "center";
    document.querySelector(".quiz-app").style.margin =  "15% auto";
   
    if (rightAnswers >= count / 2 && rightAnswers < count) {
      theResults = `<span class="good">جيد</span> <b class="shake">🙂</b> اجبت على ${rightAnswers} من ${count} <br/> <button class="replay">جيد , فالنحاول مره اخري</button>`;
    } else if (rightAnswers === count) {
      // theResults = `<span class="perfect">ممتاز</span> <b class="jump">😀</b> كل الاجابات صحيحه<br/> <button class="replay">رائع 👏 , جرب مره اخرى</button>`;
      theResults = `<span class="perfect">ممتاز</span> <b class="jump"><img src="imgs/happy.png" style="width: 130px"/></b> كل الاجابات صحيحه<br/> <button class="replay">رائع 👏 , جرب مره اخرى</button>`;
    } else {
      // theResults = `<span class="bad">سئ</span> <b class="rotate">😟</b> اجبت على ${rightAnswers} من ${count} <br/> <button class="replay"> لاباس , فالنحاول مره اخري</button>`;
      theResults = `<span class="bad">سئ</span> <b class="rotate"><img src="imgs/sad.png" style="width: 130px;"/></b> اجبت على ${rightAnswers} من ${count} <br/> <button class="replay"> لاباس , فالنحاول مره اخري</button>`;
    }

    resultsContainer.style.display = "block";
    resultsContainer.innerHTML = theResults;
    document.querySelector(".replay").onclick =  () => {
      window.location.reload();
    }
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        currentIndex = count;
        submitButton.click();
        msg.classList.remove("on");
        msg.classList.add("off");
        showResults(count);
      }
    }, 1000);
  }
}

function handelActiveClass(e) {
  // Remove Active Class From All Childrens
   e.target.parentElement.querySelectorAll(".active").forEach(element => {
     element.classList.remove("active");
   });

   // add Active Class On Self
   e.target.classList.add("active"); 
}


/*``````````````````````````````````````````````````````*/
// Toggle Spin Class On Icon
document.querySelector(".toggle-settings .fa-cog").onclick = function () {
  // Toggle Class fa-spin For Rotation For Self
  this.classList.toggle('fa-spin');
  // Toggle Class Open On Main Settings Box
  document.querySelector(".settings-box").classList.toggle('open');
};
/*``````````````````````````````````````````````````````*/

/*````````````````````````` Questions Bullets Option Setting ```````````````````````*/
let bulletSpan = document.querySelectorAll(".bullets-option span");
let bulletsLocalItem = localStorage.getItem("bullets_option");

if (bulletsLocalItem !== null) {
  if (bulletsLocalItem === 'inline-flex') {
    bulletsSpanContainer.style.display = 'inline-flex';
    document.querySelector(".bullets-option .yes").classList.add("active");
  } else {
    bulletsSpanContainer.style.display = 'none';
    document.querySelector(".bullets-option .yes").classList.remove("active");
    document.querySelector(".bullets-option .no").classList.add("active");
  }
}

bulletSpan.forEach(span => {
  span.addEventListener("click", (e) => {
    if (span.dataset.display === 'show') {
      bulletsSpanContainer.style.display = 'inline-flex';
      localStorage.setItem("bullets_option", 'inline-flex');
    } else {
      bulletsSpanContainer.style.display = 'none';
      localStorage.setItem("bullets_option", 'none');
    }
    handelActiveClass(e);
  });
});
/*````````````````````````````````````````````````*/

/*````````````````````````` Time Option Setting ```````````````````````*/
let timeSpan = document.querySelectorAll(".time-option span");
let timeLocalItem = localStorage.getItem("time_option");

if (timeLocalItem !== null) {
  if (timeLocalItem === 'block') {
    countdownElement.style.display = "block"
    document.querySelector(".time-option .yes").classList.add("active");
  } else {
    countdownElement.style.display = 'none';
    document.querySelector(".time-option .yes").classList.remove("active");
    document.querySelector(".time-option .no").classList.add("active");
  }
}
timeSpan.forEach(span => {
  span.addEventListener("click", (e) => {
    if (span.dataset.display === 'show') {
      countdownElement.style.display = "block"
      localStorage.setItem("time_option", 'block');
    } else {
      countdownElement.style.display = 'none';
      localStorage.setItem("time_option", 'none');
      // clearInterval(countdownInterval);
    }
    handelActiveClass(e);
  });
});
/*````````````````````````````````````````````````*/

/*```````````````````````` Reset Button ````````````````````````*/
// document.querySelector(".reset-option").onclick = function () {
//   // localStorage.clear(); // Clear Everything On localStorage
//   localStorage.removeItem("bullets_option");
//   localStorage.removeItem("time_option");
//   // Reload Window
//   window.location.reload();
// };
/*````````````````````````````````````````````````*/