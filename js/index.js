const elForm = document.querySelector(".user-form");
const elUserFormSearch = document.querySelector(".form-search");
const elFormSelct = document.querySelector(".form-select");
const elWarning = document.querySelector(".input-warning");
const elUseName = document.querySelector(".user-last-name");
const elLastName = document.querySelector(".user-name");

const useName = localStorage?.getItem("username");
const lastName = localStorage?.getItem("lastname");
elUseName.textContent = useName;
elLastName.textContent = lastName;

// FORM SUBMIT 
elForm.addEventListener("submit", (evt) =>{
    evt.preventDefault();
    let elUserFormSearchValue = elUserFormSearch.value
    let elformSelectValue = elFormSelct.value
    
    if(elUserFormSearchValue > 20000000) {
        elWarning.textContent = "Iltimos,0 dan katta va 20 000 000 dan kam yoki teng bo'lgan so'mma kiriting.";
        setTimeout(() => {
            elWarning.textContent = "";
        }, 7000);
    }else{
        // const newFormData = new FormData();
        // newFormData.append( "amount_credit", elUserFormSearchValue);
        // newFormData.append( "credit_term", elformSelectValue);
        
        let data = {
            "amount_credit": elUserFormSearchValue,
            "credit_term": elformSelectValue
        }
        postData(data)
    }
    
})

const tokenDat = JSON.parse(localStorage.getItem('userToken')) || [];
console.log(tokenDat);


// Endpoint URL
// const endpointUrl = 'http://34.174.72.8:8800/api/v1/credit/';

// // Fetch POST so'rovini yuborish
// const postData = (data)=>{
//     console.log(data);
//     fetch(endpointUrl, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${tokenDat.token}`,
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//     })
//     .catch(error => {
//         console.log(error);
//     });
    
// }


// POST FUNCTION 
async function postData(data) {
    console.log(data);
    try {
        const response = await axios.post('http://34.174.72.8:8800/api/v1/credit/',data, {
        headers: {
            // "Content-Type":"application/json",
            'Authorization': `Bearer ${tokenDat.token}`,
        }
    });
    console.log(response);
} catch (error) {
    console.log(error);
}
}


// TOKEN POST FUNCTION
// async function tokenData() {
//     try {
//         const response = await axios.post('http://34.174.72.8:8800/api/v1/refresh-token/');
//         console.log(response.data);
//     } catch (error) {
//         console.log(error);
//     }
// }
// tokenData()

// Refresh token so'rovini junatish funksiyasi
async function refreshAccessToken() {
    const refreshToken = getRefreshToken(); // O'zingizning refresh tokenni olishingiz kerak
    
    if (!refreshToken) {
        console.log("gfgfdg");
        window.location.href = '/login.html';
    }else{
        
    }
    const isOnline = navigator.onLine;
    
    // if (isOnline) {
    //     try {
    //         const response = await fetch('http://34.174.72.8:8800/api/v1/refresh-token/', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${refreshToken}`
    //             },
    //             // Yana kerak bo'lgan so'rov parametrlarini qo'shing
    //             // body: JSON.stringify({ key: 'value' }),
    //         });
    
    //         if (response.ok) {
    //             const newToken = await response.json();
    //             saveToken(newToken.access_token);
    //             // Agar yangi token muvaffaqiyatli olinib, uni saqlaymiz va keyin kirish sahifasiga o'tqazamiz
    //             redirectToDashboard();
    //         } else {
    //             // Agar refresh tokenni yangilashda xatolik yuz berib qolsa, boshqarishni amalga oshirish mumkin
    //             // redirectToLogin();
    //         }
    //     } catch (error) {
    //         console.error('Xatolik sodir bo\'ldi:', error);
    //     }
    // } else {
    //     // Agar foydalanuvchi internetga ulanmagan bo'lsa, boshqarishni amalga oshirish mumkin
    //     // redirectToLogin();
    // }
}

// Refresh tokenni saqlash uchun funksiya
function saveToken(newToken) {
    localStorage.setItem('userToken', JSON.stringify({ token: newToken, timestamp: Date.now() }));
}

// Refresh tokenni olish uchun funksiya
function getRefreshToken() {
    const tokenData = localStorage.getItem('userToken');
    
    if (!tokenData) {
        return null; // Agar token topilmagan bo'lsa null qaytariladi
    }
    
    const { token } = JSON.parse(tokenData);
    return token;
}

// Kirish sahifasiga o'tqazuvchi funksiya
// function redirectToDashboard() {
//     // window.location.href = 'user.html';
// }

// Login sahifasiga o'tqazuvchi funksiya
// function redirectToLogin() {
//     // window.location = '/index.html';
//     console.log("gfgfdg");
// }
refreshAccessToken();