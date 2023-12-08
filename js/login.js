const elForm = document.querySelector('.user-form');
const elUserPassword = document.querySelector('.user-password');
const elUserName = document.querySelector('.user-username');
const elFormWarning = document.querySelector('.login-warning');
const elPasswordEye = document.querySelector(".password-eye");

const tokenData = localStorage.getItem('userToken');
if (tokenData) {
    window.location.href = '/index.html';
}

elPasswordEye.addEventListener("click", () =>{
    const type = elUserPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    elUserPassword.setAttribute('type', type);
    elPasswordEye.classList.toggle('password-eye-close');
});

// FORM SUBMIT 
elForm.addEventListener("submit", (evt) =>{
    evt.preventDefault();
    let elLastUserName = elUserName.value.trim();
    let elUserPasswordValue = elUserPassword.value;
    const newFormData = new FormData();
    newFormData.append( "username", elLastUserName);
    newFormData.append( "password", elUserPasswordValue);
    
    postData(newFormData)
})

// POST FUNCTION
async function postData(data) {
    try {
        const response = await axios.post('http://34.174.72.8:8800/api/v1/profil/login/',data);
        console.log(response);
        if(response.status == 200){
            window.location = '/index.html';
            localStorage.setItem('userToken', JSON.stringify({ token: response.data.access}));
        }
    } catch (error) {
        console.log(error);
        elFormWarning.textContent = "Parol yoki Username noto'g'ri";
    }
}
