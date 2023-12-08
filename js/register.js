const elForm = document.querySelector('.user-form');
const elUser = document.querySelector('.user-name');
const elLastName = document.querySelector('.user-last_name');
const elMidlleName = document.querySelector('.middlle_name');
const elUserPassword = document.querySelector('.user-password');
const elUserName = document.querySelector('.user-username');
const elPassportText = document.querySelector('.user-pasport-text');
const elPassportNumber = document.querySelector('.user-pasport-number');
const elBtnCam = document.querySelector(".cam");
const elPasswordEye = document.querySelector(".password-eye");
const elWarning = document.querySelector(".user-warning");
// const elImagess = document.querySelector(".imagess");
const elRegisterWarning = document.querySelector(".register-warning");

const tokenData = localStorage.getItem('userToken');
if (tokenData) {
    window.location.href = '/index.html';
}

elPasswordEye.addEventListener("click", () =>{
    const type = elUserPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    elUserPassword.setAttribute('type', type);
    elPasswordEye.classList.toggle('password-eye-close');
});

elPassportText.addEventListener("keyup", () =>{
    let elPassportTextValue = elPassportText.value.toUpperCase();
    elPassportText.value = elPassportTextValue
})

// FORM SUBMIT 
elForm.addEventListener("submit", (evt) =>{
    evt.preventDefault();
    let elUserNameValue = elUser.value.trim();
    let elLastNameValue = elLastName.value.trim();
    localStorage.setItem("username", elUserNameValue)
    localStorage.setItem("lastname", elLastNameValue)
    let elelMidlleNameValue = elMidlleName.value.trim();
    let elLastUserName = elUserName.value.trim();
    let elUserPasswordValue = elUserPassword.value;
    let elPassportTextValue = elPassportText.value;
    let elPassportNumberValue = elPassportNumber.value;
    
    const newFormData = new FormData();
    newFormData.append( "name", elUserNameValue,);
    newFormData.append( "last_name", elLastNameValue,);
    newFormData.append( "middle_name", elelMidlleNameValue,);
    newFormData.append( "passport_serya", elPassportTextValue + elPassportNumberValue,);
    newFormData.append( "password", elUserPasswordValue,);
    newFormData.append( "username", elLastUserName,);
    
    const imgsFile = localStorage.getItem("capturedImage") || [];
    const base64ImageData = imgsFile;
    
    function base64ToBlob(base64Data, contentType) {
        contentType = contentType || '';
        const base64 = base64Data.split(',')[1];
        const decodedData = Uint8Array.from(atob(base64), char => char.charCodeAt(0));
        try {
            return new Blob([decodedData], { type: contentType });
        } catch (e) {
            console.error('Error creating Blob:', e);
            return null;
        }
    }
    const blob = base64ToBlob(base64ImageData, 'image/jpeg');
    if (blob) {
        const file = new File([blob], 'image_2023-12-02_23-06-91.jpg', { type: 'image/jpeg' });
        newFormData.append('image', file); 
    }
    
    // POST FUNCTION
    async function postFc(newFormData) {
        try {
            const response = await axios.post('http://34.174.72.8:8800/api/v1/profil/',newFormData);
            // console.log(response);
            if(response.status == 201){
                window.location.href = '/login.html';
            }
        } catch (error) {
            console.log(error);
            if(error.response.data.error.passport_serya == 'profile with this passport serya already exists.'){
                elRegisterWarning.textContent = "Ushbu pasportga ega profil allaqachon mavjud. Login qiling";
                elRegisterWarning.style.color = "#ce4a4a"
            }
            if (error.response.data.error == "User not found") {
                elRegisterWarning.textContent = "User topilmadi";
                elRegisterWarning.style.color = "#ce4a4a"
            }
        }
    }
    postFc(newFormData)
})

// CAMERA JS 
const video = document.getElementById('inputVideo');
const canvas = document.getElementById('overlay');
const elVedioWrap = document.querySelector(".vedio-wrap");
const elVedioWarning = document.querySelector(".vedio-warning");
const elCamerBtn = document.querySelector(".send");
const elCamerOverlay = document.querySelector(".overlay-wrap");

elBtnCam.addEventListener("click", () => {
    elVedioWrap.style.display ="flex";
    document.body.classList.add("body-hidden")
    setTimeout(() => {
        elCamerOverlay.classList.add("overlay-wrap-ative");
    }, 500);
    
    (async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
    })();
})

let cameraCount = 0;

async function onPlay() {
    const MODEL_URL = '/models';
    let camerStopCount = ++cameraCount  ;
    let camerStop = camerStopCount == 5 ? cameraCount = 0 : camerStopCount;
    
    let isFirstFaceDetected = false;
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
    await faceapi.loadFaceLandmarkModel(MODEL_URL)
    await faceapi.loadFaceRecognitionModel(MODEL_URL)
    await faceapi.loadFaceExpressionModel(MODEL_URL)
    
    let detections = await faceapi.detectAllFaces(video)
    .withFaceLandmarks()
    .withFaceDescriptors()
    .withFaceExpressions();
    
    const camImgFunc = () => {
        if (!isFirstFaceDetected && detections.length > 0) {
            const firstFace = detections[0];
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const width = firstFace.detection.box.width;
            const height = firstFace.detection.box.height;
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, firstFace.detection.box.x, firstFace.detection.box.y, width, height, 0, 0, width, height);
            
            const zoomFactor = 1.8;
            context.drawImage(video, firstFace.detection.box.x - (width * (zoomFactor - 1) / 2), firstFace.detection.box.y - (height * (zoomFactor - 1) / 2), width * zoomFactor, height * zoomFactor, 0, 0, width, height);
            
            const imageDataUrl = canvas.toDataURL('image/png');
            localStorage.setItem('capturedImage', imageDataUrl);
            isFirstFaceDetected = true;
        }
    }
    
    const dims = faceapi.matchDimensions(canvas, video, true);
    const resizedResults = faceapi.resizeResults(detections, dims);
    const sizesHegiht = Math.floor(resizedResults[0]?.alignedRect.box.height)
    
    if(camerStop == 4){
        elVedioWrap.style.display ="none";
        elCamerOverlay.classList.remove("overlay-wrap-ative");
        elVedioWarning.textContent = "";
        elRegisterWarning.textContent = "Ko'z oynagiz bo'lsa olib qo'ying va qayta urunib ko'ring";
        elRegisterWarning.style.color = "#ce4a4a";
        document.body.classList.remove("body-hidden");
    }else  if (sizesHegiht <= 200 ) {
        console.log("Yaqin keling");
        elVedioWarning.textContent = "Yaqinroq keling";
        setTimeout(onPlay, 100);
    }else if (resizedResults.length == 0) {
        setTimeout(onPlay, 100);
        elVedioWarning.textContent = "Kameraga qarang";
        console.log("Topilmadi");
    }else{
        camImgFunc();
        console.log("Tushdi");
        elVedioWarning.textContent = ""
        elCamerBtn.disabled = false;
        elCamerBtn.background = "#107DDB";
        elVedioWrap.style.display ="none";
        elCamerOverlay.classList.remove("overlay-wrap-ative");
        elRegisterWarning.textContent = "Yuborishni bosing";
        elRegisterWarning.style.color = "#02fa23";
        document.body.classList.remove("body-hidden");
        
        // Kamerani o'chirish
        const stopCamera = () => {
            const stream = inputVideo.srcObject;  
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                console.log("Kamera muvaffaqiyatli o'chirildi!");
            }
        };
        stopCamera()

    }
    
    faceapi.draw.drawDetections(canvas, resizedResults);
    // faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
    // faceapi.draw.drawFaceExpressions(canvas, resizedResults, 0.05);
}



