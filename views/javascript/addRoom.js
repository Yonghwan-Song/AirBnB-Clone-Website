var addRoomBody = document.querySelector('.addRoom');

addRoomBody.addEventListener('submit',(e)=>{
    var title=addRoomBody.title.value;
    var price=addRoomBody.price.value;
    var description=addRoomBody.description.value;
    var location=addRoomBody.location.value;
    var file=addRoomBody.photo.value;

    var em1=document.querySelector('.errorM1');
    var em2=document.querySelector('.errorM2');

    if(title===""||price===""||description===""||location===""){
        em1.style.display='block';
        e.preventDefault();
        console.log("Are you there?~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    }else if(!file){
        em2.style.display='block';
        e.preventDefault();
    }
});