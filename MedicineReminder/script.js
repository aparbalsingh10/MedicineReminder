/* =====================================
   AUTHENTICATION
===================================== */


function showSignup() {

    document.getElementById("loginSection").style.display = "none";

    document.getElementById("signupSection").style.display = "block";

    document.getElementById("authMessage").textContent = "";
}


function showLogin() {

    document.getElementById("signupSection").style.display = "none";

    document.getElementById("loginSection").style.display = "block";

    document.getElementById("authMessage").textContent = "";
}


/* SIGN UP */

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const name =
            document.getElementById("signupName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        if (password !== confirmPassword) {

            showMessage("Passwords do not match.");

            return;
        }


        const existingUser =
            JSON.parse(localStorage.getItem("user"));


        if (
            existingUser &&
            existingUser.email === email
        ) {

            showMessage("Account already exists. Please login.");

            return;
        }


        const user = {

            name: name,

            email: email,

            password: password

        };


        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        showMessage(
            "Account created successfully! Please login."
        );


        signupForm.reset();


        setTimeout(function() {

            showLogin();

            document.getElementById("loginEmail").value = email;

        }, 1000);

    });

}


/* LOGIN */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        const user =
            JSON.parse(localStorage.getItem("user"));


        if (!user) {

            showMessage(
                "No account found. Please Sign Up first."
            );

            return;
        }


        if (
            email === user.email &&
            password === user.password
        ) {

            localStorage.setItem(
                "loggedIn",
                "true"
            );


            window.location.href =
                "dashboard.html";

        } else {

            showMessage(
                "Invalid email or password."
            );

        }

    });

}


function showMessage(message) {

    const messageBox =
        document.getElementById("authMessage");

    if (messageBox) {

        messageBox.textContent = message;

    }

}


/* LOGOUT */

function logout() {

    localStorage.removeItem("loggedIn");

    window.location.href =
        "index.html";

}


/* =====================================
   DASHBOARD
===================================== */


/* Protect dashboard */

if (
    window.location.pathname.includes("dashboard.html")
) {

    const loggedIn =
        localStorage.getItem("loggedIn");


    if (loggedIn !== "true") {

        window.location.href =
            "index.html";

    }

}


/* Get current user */

function getUser() {

    return JSON.parse(
        localStorage.getItem("user")
    );

}


/* Display user */

function displayUser() {

    const user = getUser();

    if (!user) return;


    const userName =
        document.getElementById("userName");

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const avatar =
        document.getElementById("avatar");

    const profileAvatar =
        document.getElementById("profileAvatar");


    if (userName)
        userName.textContent = user.name;


    if (profileName)
        profileName.textContent = user.name;


    if (profileEmail)
        profileEmail.textContent = user.email;


    const firstLetter =
        user.name.charAt(0).toUpperCase();


    if (avatar)
        avatar.textContent = firstLetter;


    if (profileAvatar)
        profileAvatar.textContent = firstLetter;

}


displayUser();


/* Date */

function displayDate() {

    const dateElement =
        document.getElementById("todayDate");


    if (!dateElement) return;


    const today = new Date();


    dateElement.textContent =
        today.toLocaleDateString(
            "en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}


displayDate();


/* =====================================
   MEDICINES
===================================== */


function getMedicines() {

    return JSON.parse(
        localStorage.getItem("medicines")
    ) || [];

}


function saveMedicines(medicines) {

    localStorage.setItem(
        "medicines",
        JSON.stringify(medicines)
    );

}


/* ADD MEDICINE */

const medicineForm =
    document.getElementById("medicineForm");


if (medicineForm) {

    medicineForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById("medicineName")
                .value.trim();

            const dosage =
                document.getElementById("dosage")
                .value.trim();

            const time =
                document.getElementById("medicineTime")
                .value;

            const frequency =
                document.getElementById("frequency")
                .value;

            const startDate =
                document.getElementById("startDate")
                .value;

            const endDate =
                document.getElementById("endDate")
                .value;


            if (endDate < startDate) {

                alert(
                    "End date cannot be before start date."
                );

                return;

            }


            const medicines =
                getMedicines();


            const medicine = {

                id: Date.now(),

                name: name,

                dosage: dosage,

                time: time,

                frequency: frequency,

                startDate: startDate,

                endDate: endDate,

                taken: false,

                history: []

            };


            medicines.push(medicine);


            saveMedicines(medicines);


            medicineForm.reset();


            displayMedicines();

            updateStats();

        }
    );

}


/* DISPLAY MEDICINES */

function displayMedicines() {

    const list =
        document.getElementById("medicineList");

    const empty =
        document.getElementById("noMedicine");


    if (!list) return;


    const medicines =
        getMedicines();


    list.innerHTML = "";


    if (medicines.length === 0) {

        empty.style.display = "block";

        return;

    }


    empty.style.display = "none";


    medicines.forEach(function(medicine) {


                const status =
                    getMedicineStatus(medicine);


                const card =
                    document.createElement("div");


                card.className =
                    "medicine-card";


                card.innerHTML = `

            <div class="medicine-info">

                <div class="medicine-icon">
                    💊
                </div>

                <div>

                    <h3>
                        ${escapeHTML(medicine.name)}
                    </h3>

                    <p>
                        Dosage: ${escapeHTML(medicine.dosage)}
                    </p>

                    <p>
                        ⏰ ${formatTime(medicine.time)}
                    </p>

                    <p>
                        ${escapeHTML(medicine.frequency)}
                    </p>

                </div>

            </div>


            <div class="medicine-actions">

                <span class="status ${status.class}">
                    ${status.text}
                </span>


                ${
                    !medicine.taken
                    ?
                    `
                    <button
                        class="take-btn"
                        onclick="takeMedicine(${medicine.id})"
                    >
                        ✓ Take
                    </button>
                    `
                    :
                    ""
                }


                <button
                    class="delete-btn"
                    onclick="deleteMedicine(${medicine.id})"
                >
                    🗑
                </button>

            </div>

        `;


        list.appendChild(card);

    });


    updateStats();

}




function getMedicineStatus(medicine) {

    if (medicine.taken) {

        return {
            text: "Taken",
            class: "taken"
        };

    }


    const now =
        new Date();


    const [hours, minutes] =
        medicine.time.split(":");


    const medicineTime =
        new Date();


    medicineTime.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
    );


    if (medicineTime < now) {

        return {
            text: "Missed",
            class: "missed"
        };

    }


    return {
        text: "Upcoming",
        class: "upcoming"
    };

}


/* TAKE MEDICINE */

function takeMedicine(id) {

    const medicines =
        getMedicines();


    const medicine =
        medicines.find(
            item => item.id === id
        );


    if (!medicine) return;


    medicine.taken = true;


    medicine.history.push({

        date:
            new Date().toLocaleDateString(),

        time:
            new Date().toLocaleTimeString(),

        status:
            "Taken"

    });


    saveMedicines(medicines);


    displayMedicines();

    displayHistory();

    updateStats();

}


/* DELETE */

function deleteMedicine(id) {

    const medicines =
        getMedicines();


    const updated =
        medicines.filter(
            medicine => medicine.id !== id
        );


    saveMedicines(updated);


    displayMedicines();

    displayHistory();

    updateStats();

}



function updateStats() {

    const medicines =
        getMedicines();


    const total =
        medicines.length;


    const taken =
        medicines.filter(
            medicine => medicine.taken
        ).length;


    const missed =
        medicines.filter(
            medicine =>
                getMedicineStatus(medicine).text === "Missed"
        ).length;


    const upcoming =
        medicines.filter(
            medicine =>
                getMedicineStatus(medicine).text === "Upcoming"
        ).length;


    const totalElement =
        document.getElementById(
            "totalMedicines"
        );


    const upcomingElement =
        document.getElementById(
            "upcomingMedicines"
        );


    const takenElement =
        document.getElementById(
            "takenMedicines"
        );


    const missedElement =
        document.getElementById(
            "missedMedicines"
        );


    if (totalElement)
        totalElement.textContent = total;


    if (upcomingElement)
        upcomingElement.textContent = upcoming;


    if (takenElement)
        takenElement.textContent = taken;


    if (missedElement)
        missedElement.textContent = missed;

}


function displayHistory() {

    const historyList =
        document.getElementById("historyList");

    const noHistory =
        document.getElementById("noHistory");


    if (!historyList) return;


    const medicines =
        getMedicines();


    historyList.innerHTML = "";


    let hasHistory = false;


    medicines.forEach(function(medicine) {

        medicine.history.forEach(function(record) {

            hasHistory = true;


            const item =
                document.createElement("div");


            item.className =
                "history-card";


            item.innerHTML = `

                <h3>
                    💊 ${escapeHTML(medicine.name)}
                </h3>

                <p>
                    ${record.date}
                    •
                    ${record.time}
                    •
                    ${record.status}
                </p>

            `;


            historyList.appendChild(item);

        });

    });


    if (noHistory) {

        noHistory.style.display =
            hasHistory ? "none" : "block";

    }

}



let currentReminderId = null;


function checkReminder() {

    const medicines =
        getMedicines();


    const now =
        new Date();


    const currentTime =
        String(now.getHours()).padStart(2, "0")
        +
        ":"
        +
        String(now.getMinutes()).padStart(2, "0");


    medicines.forEach(function(medicine) {

        if (
            medicine.time === currentTime &&
            !medicine.taken
        ) {

            showReminder(medicine);

        }

    });

}


function showReminder(medicine) {

    const modal =
        document.getElementById(
            "reminderModal"
        );


    const message =
        document.getElementById(
            "reminderMessage"
        );


    if (!modal) return;


    currentReminderId =
        medicine.id;


    message.textContent =
        `It is time to take ${medicine.name} (${medicine.dosage}).`;


    modal.style.display =
        "flex";


    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        new Notification(
            "Medicine Reminder",
            {
                body:
                    `Time to take ${medicine.name}`
            }
        );

    }

}


function closeReminder() {

    const modal =
        document.getElementById(
            "reminderModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


function takeReminderMedicine() {

    if (currentReminderId) {

        takeMedicine(
            currentReminderId
        );

    }


    closeReminder();

}


if ("Notification" in window) {

    if (
        Notification.permission === "default"
    ) {

        Notification.requestPermission();

    }

}

function formatTime(time) {

    const [hourString, minute] =
        time.split(":");


    let hour =
        Number(hourString);


    const ampm =
        hour >= 12 ? "PM" : "AM";


    if (hour > 12) {

        hour -= 12;

    }


    if (hour === 0) {

        hour = 12;

    }


    return `${hour}:${minute} ${ampm}`;

}


function escapeHTML(value) {

    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

displayMedicines();

displayHistory();

updateStats();


setInterval(
    checkReminder,
    30000
);