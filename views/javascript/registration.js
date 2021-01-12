var modalContent = document.querySelector('.modal-content');
var modalContainer = document.querySelector('.modal-container');
var signUp = document.querySelector('.navbar__sign-up');

signUp.addEventListener('click', function () {
    modalContainer.style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function () {
    modalContainer.style.display = 'none';
});

window.onclick = function (event) {
    if (event.target == modalContainer) {
        modalContainer.style.display = 'none';
    }
};

const threeBars = document.querySelector('#three-bars');
const menu = document.querySelector('.navbar__menu');
threeBars.addEventListener('click',()=>{
    menu.classList.toggle('active');
    signUp.classList.toggle('active');
});

var formBody = document.querySelector('.register');
var button = document.querySelector('#submit');

// button.addEventListener('click',function(e){ 
// <-- it worked well before setting up connection to mongoDB. But after that it does not
// but basically, it was not adequate. the click event is associated with submit in this case but not submit itself.
// The submit event exists on its own!. 
    formBody.addEventListener('submit',function(e){
    var pwd = formBody.password.value;
    var pwd_to_string = String(pwd);
    var pattern = new RegExp('^[a-zA-Z0-9]*$');

    var errorMsg1 = document.querySelector('.errorMessage1');
    var errorMsg2 = document.querySelector('.errorMessage2');
    if(!pattern.test(pwd_to_string)){
        errorMsg1.style.display='block';
        errorMsg2.style.display='none';
        e.preventDefault();
    }else if(pwd_to_string.length<6||pwd_to_string.length>12){
        errorMsg2.style.display='block';
        errorMsg1.style.display='none';
        e.preventDefault();
    }
    if(!pattern.test(pwd_to_string)&&
    (pwd_to_string.length<6||pwd_to_string.length>12)){
        errorMsg2.style.display='block';
        errorMsg1.style.display='block';
        e.preventDefault();
    }
});

// formBody.addEventListener('submit',function(event){
//     var pwd = formBody.password.value;
//     var pwd_to_string = String(pwd);
//     var pattern = new RegExp('^[a-zA-Z0-9]*$');

//     var errorMsg1 = document.querySelector('.errorMessage1');
//     var errorMsg2 = document.querySelector('.errorMessage2');
//     if(!pattern.test(pwd_to_string)){
//         errorMsg1.style.display='block';
//         event.preventDefault();
//     }else if(pwd_to_string.length<6||pwd_to_string.length>12){
//         errorMsg2.style.display='block';
//         event.preventDefault();
//     }
// });


