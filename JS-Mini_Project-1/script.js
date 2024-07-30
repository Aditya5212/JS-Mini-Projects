const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNum]");
const copyBtn = document.querySelector("[data-copy]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
// const sliderLength = document.querySelector("[data-lengthSlider]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-Indicator]");
const generateBtn = document.querySelector("#generate-button");
const checkBoxAll = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 0;
const symbolString = "!#$%&'()*+,-./:;<=>?@[]^_`{|}"

handleSlider();

//set strength colour to biege

//copy content

//handel slider
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength; 
}

//generate pass

//set indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    // indicator.setAttribute("style","shadow")
}

//get random int(min,max)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Generate Random number
//get random number
function generateRandomNumber(){
    return getRandomInt(0,9);
}
//get random uppercase
function generateUpperCase(){
    return String.fromCharCode(getRandomInt(65,90));
}

//get random lowercase
function generateLowerCase(){
    return String.fromCharCode(getRandomInt(97,122));
}

//get random symbol
function generateSymbol(){
    const randomNum = getRandomInt(0,symbolString.length);
    return symbolString.charAt(randomNum);
}

//calculate strength
function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(upperCaseCheck.checked) hasUpper = true;
    if(lowerCaseCheck.checked) hasLower = true;
    if(numCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true;
    // Password is hard
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    } else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ){
        setIndicator("#ff0");
    } else{
        setIndicator("#f00");
    }
}




async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied"
    // alert("copied")
  } catch (error) {
    console.error(error.message);
    copyMsg.innerText = "Failed"
  }
  copyMsg.classList.add("active")

  setTimeout(()=>{
    copyMsg.classList.remove("active")
  },2000)
}


inputSlider.addEventListener('input',(event)=>{
    passwordLength = event.target.value;
    handleSlider();
})


copyBtn.addEventListener('click',(event)=>{
    if(passwordDisplay.value) {
        copyContent();
    }else{
        alert("Password has not been generated")
    }
})


function handleCheckboxes(){
    checkCount = 0;
    checkBoxAll.forEach((checkBox)=>{
        if(checkBox.checked){
            checkCount++;
        }

        if(checkCount > passwordLength){
            // alert("Password length is less than the number of selected characters")
            passwordLength=checkCount;
            handleSlider();
        }

    })
}


checkBoxAll.forEach((checkBox)=>{
    checkBox.addEventListener('change',handleCheckboxes)
})


function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";
    let funcArr = [];

    if(upperCaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowerCaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolCheck.checked)
        funcArr.push(generateSymbol);



    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRandomInt(0 , funcArr.length-1);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calculateStrength();
});
