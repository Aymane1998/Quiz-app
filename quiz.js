//Select Elements

let countSpan=  document.querySelector(".count span");
let bulletsSpanContainer= document.querySelector(".bullets .spans");
let qArea= document.querySelector(".quiz-area");
let answersArea= document.querySelector(".answers-area");
let subButton= document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
// Set Options
let currentIndex=0;
let  rightAnswers =0;
let countdownInterval;


function getQuestion(){
    let myRequest = new XMLHttpRequest();
    

    myRequest.onreadystatechange= function(){
        if(this.readyState === 4 && this.status === 200){
            
            let questionsObjet = JSON.parse(this.responseText); // ghadi tjib lya les élements li f JSON file
            let qCount=questionsObjet.length; // Chhal mn question kayna

            //create Bullets + set Questions Count
            createBullets(qCount);

            //Add questions data
            addQuestionsData(questionsObjet[currentIndex],qCount);

            // Start countDown
            countdown(10, qCount);

            //Click on Submit
            subButton.onclick= ()=> {
              // Get Right Answer
              let rightAnswer=  questionsObjet[currentIndex].right_answer;
              
              countdown(9, qCount);
              // Increse Index

              currentIndex++;

              //Check The Answer
              chekckAnswer(rightAnswer,qCount);

              //Remove Previous Question
              qArea.innerHTML="";
              answersArea.innerHTML="";

               //Add questions data
                addQuestionsData(questionsObjet[currentIndex],qCount);

                //Handle Bullets Class
                handelBullets();

                //Show results
                showResults(qCount);
            };


        }
    };

    myRequest.open("GET","questions.json",true);
    myRequest.send();
}

getQuestion();

function createBullets(num){
    countSpan.innerHTML=num;

    //Create Spans
    for(let i = 0; i<num ; i++){

        //Creat Span bach nhettu f class spans li feha le nbr des questions
        let theBullet= document.createElement("span");
        // nchufo wach rah fl first Span
        if (i==0) {
            theBullet.className="on";
        }

        //Append bullet to Main bullet Container
        bulletsSpanContainer.appendChild(theBullet);


    }
}

function addQuestionsData(obj,count) {
    if (currentIndex < count) {
        
    
        // Create H2 Question Title
        let qtitle = document.createElement("h2");
        

        //Create Question Text

        let qText= document.createTextNode(obj['title']);

        //Append Text to H2

        qtitle.appendChild(qText);

        //Append H2 to Quiz Area

        qArea.appendChild(qtitle);

        //Create the answers

        for(let i=1; i<= 4 ; i++){
            // Create Main Answer Div
            let mainDiv = document.createElement("div");
            mainDiv.className='answer';

            //Create radio Input

            let radioInput= document.createElement("input");
            // Add type+ Name +Id + Data-Attribute
            radioInput.name="question";
            radioInput.type="radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer=obj[`answer_${i}`];

            //Make the first Option Selected 
             
            if(i==1){
                radioInput.checked= true;

            }

            //Create label 
            
            let theLabel= document.createElement("label");

            // Add For Attribute 

            theLabel.htmlFor = `answer_${i}`;
            
            // Create label Text

            let labelText=document.createTextNode(obj[`answer_${i}`]);

            // Add The text to label 

            theLabel.appendChild(labelText);

            //Add  Input + label To MAIN Div 

            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            // Append All divs to answers Area
            answersArea.appendChild(mainDiv);
        }
}

}

function chekckAnswer(aAnswer,count){

    let Answers= document.getElementsByName("question");
    let ChoosenAnswer;

    for(let i=0;i<Answers.length;i++){

        if(Answers[i].checked){

            ChoosenAnswer= Answers[i].dataset.answer;
        }
    }

    console.log(`Right Anwser is :${aAnswer}`);
    console.log(`Choosen Anwser is :${ChoosenAnswer}`);

    if(aAnswer===ChoosenAnswer){
        rightAnswers++;
        console.log("Good Answer");
    }
}

function handelBullets(){
    let bulletsSpan= document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans= Array.from(bulletsSpan);
    arrayOfSpans.forEach((span,index) => {
        if(currentIndex===index){
            span.className="on";
        }
    });
}

function showResults(count){
    let theResults;
    if(currentIndex === count){
        console.log("Questions are finished");
        qArea.remove();
        answersArea.remove();
        subButton.remove();
        bullets.remove();

        if(rightAnswers > count / 2 && rightAnswers < count){
            theResults= `<span class ="good"> Good </span>, ${rightAnswers} from ${count} is good`;
        } else if(rightAnswers === count){
            theResults= `<span class ="perfect"> Perfect </span>, ${rightAnswers} All answers are Right`;
        } else{
            theResults= `<span class ="bad "> Bad result </span>, ${rightAnswers} from ${count} bad rait`;
        }

         resultsContainer.innerHTML=theResults;
         resultsContainer.style.padding="20px";
         resultsContainer.style.marginTop="10px";
    }
}

function countdown(duration, count){
    if(currentIndex < count){
        let minutes,seconds;
        countdownInterval= setInterval(function(){
            minutes=parseInt(duration/60);
            seconds=parseInt(duration % 60);
            minutes= minutes < 10 ? `0${minutes}`:minutes;
            seconds= seconds < 10 ? `0${seconds}`:seconds;

            countdownElement.innerHTML=`${minutes}:${seconds}`;

            if(--duration <0 ){
                clearInterval(countdownInterval);
                subButton.click();
            }

        },1000 );
    }
}