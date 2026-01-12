
const video = document.getElementById("video");

// ======================
// ⚠️ URL AI SERVER (NGROK)
// ======================
const API_URL = "https://mabel-unsapiential-brynn.ngrok-free.dev";
//const API_URL = "http://127.0.0.1:8000";
//  http://127.0.0.1:8000

// ======================
// BẬT CAMERA
// ======================
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        alert("Không mở được camera");
    });

// ======================
// ENROLL – ĐĂNG KÝ
// ======================
function capture() {
    const name = document.getElementById("name").value;
    if (!name) {
        alert("Chưa nhập tên");
        return;
    }

    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
        enrollToServer(name, blob);
    }, "image/jpeg");
}

function enrollToServer(name, imageBlob) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", imageBlob, "face.jpg");

    fetch(API_URL + "/enroll", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "ok") {
            showIcon("✔️");
        } else {
            showIcon("❌");
        }
    })
    .catch(() => showIcon("❌"));
}

// ======================
// RECOGNIZE – NHẬN DIỆN
// ======================
function recognize() {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append("image", blob, "face.jpg");

        fetch(API_URL + "/recognize", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.name !== "Unknown" && data.door_status === "opening") {
                showIcon("✔️");
            } else {
                showIcon("❌");
            }
        })
        .catch(() => showIcon("❌"));
    }, "image/jpeg");
}

// ======================
// HIỂN THỊ ICON
// ======================
function showIcon(symbol) {
    const icon = document.getElementById("overlay-icon");
    icon.innerText = symbol;
    icon.style.display = "flex";

    setTimeout(() => {
        icon.style.display = "none";
    }, 1200);
}


