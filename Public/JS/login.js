  document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const loginForm = document.getElementById('loginForm');
  
  const btnSubmit = document.getElementById('btnSubmit'); // Uncomment if deliveryInfo is used

  const btnShowPassword = document.getElementById('btnShowPassword');
  const passwordInputs = form.querySelectorAll('input.password');

  // Toast elements and Bootstrap Toast instance
  const toastElement = document.getElementById('messageToastCont');
  const toastText = document.getElementById('messageToastText');
  const toastIcon = document.getElementById('messageToastIcon');
  const toast = new bootstrap.Toast(toastElement);

  // Helper: Show toast message
  function showToast(message, type = 'error') {
    toastText.textContent = message;

    // Update icon and color based on type
    if (type === 'error') {
      toastIcon.className = 'fa fa-times text-danger';
    } else if (type === 'success') {
      toastIcon.className = 'fa fa-check text-success';
    } else {
      toastIcon.className = 'fa fa-info-circle text-info';
    }

    toast.show();
  }
  
  // Validate current step inputs (basic HTML5 validation)
  function validateAccountInfo() {
    
    // Use checkValidity on inputs inside current fieldset
    const inputs = loginForm.querySelectorAll('input, select, textarea');
    
    let emailAddress = loginForm.getElementById("emailAddress")
    let password = loginForm.getElementById("password")
    
    
    for (const input of inputs) {
      input.addEventListener("input",  (e)=>{
        input.value = input.value.replace(/[<>]/g, " ")
        console.log(input.value)
      })
      
      if (!input.checkValidity()) {
        input.focus();
        showToast(input.validationMessage || 'Please fill out this field correctly.', 'error');
        return false;
      }
    }
    
    fetch("/auth/login", {
      method: "post",
      body: json.stringify({
        emailAddress: emailAddress.value,
        password: password.value,
      })
    })
    .then((response)=> response.json())
    .then((data)=>{
      if(!data.success){
        showToast(data.message, "error")
        return false
      }
    })
    return true
  }
  

      
  // Event: Next button on Personal Info
  btnSubmit.addEventListener('click', (e) => {
    e.preventDefault()
    
    if (!validateAccountInfo()) return;
   
    showToast('Personal information validated.', 'success');
    loginForm.submit()
  });


  // Event: Toggle password visibility
  btnShowPassword.addEventListener('click', () => {
    passwordInputs.forEach((input) => {
      if (input.type === 'password') {
        input.type = 'text';
        btnShowPassword.setAttribute('aria-label', 'Hide password');
      } else {
        input.type = 'password';
        btnShowPassword.setAttribute('aria-label', 'Show password');
      }
    });
  });
});
