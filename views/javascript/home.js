var modalContent = document.querySelector('.modal-content');
var modalContainer = document.querySelector('.modal-container');
var signUp = document.querySelector('.navbar__sign-up');

signUp.addEventListener('click', function () {
    modalContainer.style.display = 'block';
});

// document.querySelector('.close').addEventListener('click', function () {
//     modalContainer.style.display = 'none';
// });

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

