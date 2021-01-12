var numOfpeople = document.querySelector('#numOfpeople');
var dates = document.querySelector('#dates');

var bookingForm = document.querySelector('.booking');

bookingForm.addEventListener('submit',(e)=>{
    console.log("In Submit eventListener------------");
    var startDate = bookingForm.checkIn.value;
    var endDate = bookingForm.checkOut.value;
    var guestNum = bookingForm.guestNum.value;
    
    console.log("startDate is: "+startDate);
    console.log("endDate is: "+endDate);
    console.log("GuestNum is: "+guestNum);
  if(startDate===""||endDate===""){
    dates.style.display="block"; 
    e.preventDefault();
     
  }else if(guestNum===""){
    numOfpeople.style.display="block";
    e.preventDefault();
  }
});

var checkIn_Element=document.querySelector('#check-in');
var checkOut_Element=document.querySelector('#check-out');

var determiner=false; //will be true when both of the check in out dates are provided.
var first; //because user normally first choose check-in date..
var second; //check-out date.
const datediff = document.querySelector('.datediff');
const priceEstimate = document.querySelector('.priceEstimate');

checkIn_Element.addEventListener('change',(e)=>{
  first = bookingForm.checkIn.value;
  var startDate = new Date(first);
  
  if(second!==""){
    var endDate = new Date(second);
    var howmanyDays =  (endDate.getTime()-startDate.getTime())/(1000 * 60 * 60 * 24);
    var totalPrice = howmanyDays*(bookingForm.pricePerNight.value);
    datediff.textContent=`The number of days: ${howmanyDays}`;
    priceEstimate.textContent=`Total price: ${totalPrice}`;
  }
});

checkOut_Element.addEventListener('change',(e)=>{
  
  second = bookingForm.checkOut.value
  var endDate = new Date(second);

  if(first!==""){
    var startDate = new Date(first);
    var howmanyDays =  (endDate.getTime()-startDate.getTime())/(1000 * 60 * 60 * 24);
    var totalPrice = howmanyDays*(bookingForm.pricePerNight.value);
    datediff.textContent=`The number of days: ${howmanyDays}`;
    priceEstimate.textContent=`Total price: ${totalPrice}`;
  }
});

// checkOut_Element.addEventListener('change',(e)=>{
//   var endDate = new Date(bookingForm.checkOut.value);
//   console.log("endDate in Change L"+endDate);
//   var startDate = new Date(first)
//   const datediff = document.querySelector('.datediff');
//   const priceEstimate = document.querySelector('.priceEstimate');
//   determiner=true;
//   if(determiner===true){
//     datediff.textContent=`Hello World`;
//     priceEstimate.textContent='This much';
//   }
// });

////Don't need it........ why did you make this...
// var guestNum_Element=document.querySelector('#guest-num');
// guestNum_Element.addEventListener('change',(e)=>{
//   var guestNum = bookingForm.guestNum.value;
//   console.log("guestNum in Change L: "+guestNum);
// });



