
let myForm = document.getElementById('coursesID');
let count=document.getElementById("course_count");
let btn=document.getElementById("button");
// let btn2=document.getElementById("button2");
let results = document.getElementById("courseDetails");
let errorDiv = document.getElementById('error-container');
let errorTextElement = errorDiv.getElementsByClassName('alert alert-danger')[0];
let frmLabel = document.getElementById('formLabel');

// let myDl = document.getElementById('courses');

if (myForm) {
  myForm.addEventListener('submit', (event) => {
    const submitBtn = document.getElementById("first_button");
submitBtn.addEventListener("click", function(event) {
  event.preventDefault(); 

});
    // event.preventDefault();
    if (count.value) {
        try{
            // count.classList.remove('inputClass');
            errorDiv.classList.add('hidden');
            btn.style.visibility='hidden';
            btn.style.display='none';
            // frmLabel.classList.remove('error');

            while(results.hasChildNodes()){
                results.removeChild(results.lastChild);
            }
            let courseLabel=document.createElement("label")
            courseLabel.innerHTML="Enter Course Names: "
            courseLabel.className="row pt-4"
            results.appendChild(courseLabel)
            results.appendChild(document.createElement("br"))
            for(let i=0;i<parseInt(count.value);i++){
                let courseName = document.createElement("input");
                courseName.placeholder = "Course "+(i+1);
                courseName.className="form-group"
                results.appendChild(courseName);
            }
            results.appendChild(document.createElement("br"))
            // btn2.style.visibility='visible';

            let btn2=document.createElement("button")
            btn2.innerHTML="Add Course Names"
            btn2.className="btn1"
            btn2.type="submit"
            results.appendChild(btn2) 
            myForm.submit()
        }
        catch(e){
            const message = typeof e === 'string' ? e : e.message;
            errorTextElement.textContent = e;
            errorDiv.classList.remove('hidden');
        }
    } else {
      count.value = '';
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'You must enter a value';
      frmLabel.className = 'error';
      count.focus();
      count.className = 'inputClass';
    }
  });
}
