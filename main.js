//02 - Create questions
//02- 01 Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans")
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");


//Set Options
let currentIndex = 0; 
let rightAnswers = 0; 
let countdownIntervale; 

//01- Create The AJAX Request : Get the Data from the file JSON 
function getQuestions() {
    myRequest = new XMLHttpRequest()
    //[1] Flow Request sent it and check it
    myRequest.onreadystatechange = function () { 
       
        if (this.readyState === 4 && this.status === 200) { 
            let questionsObject = JSON.parse(this.responseText) 
            let qCount = questionsObject.length 
               console.log(questionsObject)
            //console.log(this.responseText)

           //03 - Create Bullets
            //create Bullets + Set Questions Count
            createBullets(qCount)

             addQuestionData(questionsObject[currentIndex], qCount)
          
          
            //06- Click On Submit
            submitButton.onclick = () => {
                //Get the right answer
                let TheRightAnswer = questionsObject[currentIndex].right_answer;
                console.log(TheRightAnswer);
                
                //Increase Index => to move to another question
                currentIndex++;

                //check the answer: Func
                checkAnswer(TheRightAnswer, qCount);
            
                //11-01-get Question
                //Remove previous question and move to the next question
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";

               //11-02-get Question
            addQuestionData(questionsObject[currentIndex], qCount)
                
              //Handle Bullets class
                handleBullets();

                    //start CountDown
                clearInterval(countdownIntervale); 
                 countDown(5, qCount);
                
               //show results
                showResults(qCount);
            }
        }
    }
     //[0] Send Request
     myRequest.open("GET", "html_questions.json", true); // the URL(API) should be taken by the backend developer
     myRequest.send();

}
//05-
getQuestions()
//03 - Create Bullets
function createBullets(num) {
    
    //the count of question aboce
    countSpan.innerHTML = num;
 
    //create Spans on DOM
    let i = 0;
   
    for (; i < num; i++) {
        //create Bullet
        let theBullet = document.createElement("span");
        //Check If Its First Span
        if (i === 0) {
            theBullet.className = "on";
        }
        //Append Bullets To Main Bullet Container
        bulletsSpanContainer.appendChild(theBullet)
    }
}
//04- Create questions on DOM

function addQuestionData(obj, count) {
    

    if (currentIndex < count) { 
  
        console.log(obj)
        console.log(count)
        //Create H2 Questions Title
        let questionTitle = document.createElement("h2");

        //Create Question Text
        let questionText = document.createTextNode(obj['title']);

        //Append Text To h2
        questionTitle.appendChild(questionText);

        //Append The H2 To The Quiz Area
        quizArea.appendChild(questionTitle);

        //Create The Answers
        for (let i = 1; i <= 4; i++) {

            //create Main Answer Div
            let mainDiv = document.createElement("div");

            //Add Class To Main Div
            mainDiv.className = 'answer';

            //Create Radio Input
            let radioInput = document.createElement("input");

            //Add Type  + Name + Id + Data-Attribute
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`; 
            //The response mtaa the same question
            radioInput.dataset.answer = obj[`answer_${i}`]; 

            //Make First Option Selected
            if (i === 1) {
                radioInput.checked = true;
            }
            //Create Label
            let theLabel1 = document.createElement("label");

            //Add For Attribute
            theLabel1.htmlFor = `answer_${i}`;

            //Create Label Text
            //the answer will be in teh input and here
            let theLabelText = document.createTextNode(obj[`answer_${i}`])
        
            //Add the Text To Label
            theLabel1.appendChild(theLabelText);

            //Add Input + Label To Main Div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel1)
        
            //Append All divs To answers Area
            answersArea.appendChild(mainDiv);
        }
    }
}
function checkAnswer(rAnswer, count) {
    // console.log(rAnswer);
    // console.log(count);
    let answers = document.getElementsByTagName("question");
    let theChosenAnswer;

    for(let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
             theChosenAnswer = answers[i].dataset.answer;

            
        }
    }
    console.log(`Right Answer is: ${rAnswer}`);
    console.log(`Chosen Answer is: ${theChosenAnswer }`);


    if (rAnswer === theChosenAnswer) {
        rightAnswers++; 
        console.log("Good Answer");
    }
}

//11-04-get nex Question 
function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    //put all the spans an array
    let arrayOfSpans = Array.from(bulletsSpans);
console.log(arrayOfSpans)
    //looping to all teh spans
    arrayOfSpans.forEach((span, index) => {
        
        if (currentIndex === index) {
            // console.log(currentIndex)
            // console.log(index)
            span.className = "on";              
        }
    })
}
//12-01-Show results functions
function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        //     console.log(currentIndex)
        //     console.log(count)
        //     console.log("questions are finished")
        // 
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswer} From ${count}`;
   
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All answers is good`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
        }
        
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "10px";

    }

}
function countDown(duration, count) {
    if (currentIndex < count) {
     
        let minutes, seconds;
        countdownIntervale = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60); 
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes}: ${seconds}`
       
            if (--duration < 0) {
                clearInterval(countdownIntervale);
                console.log("Finished")
                
                submitButton.click();
            }
        }, 1000);



    }
}

