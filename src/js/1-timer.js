import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const endingTime = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("button[data-start]");

let selectedTime = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    selectedTime = selectedDates[0].getTime();
    if (selectedTime < Date.now()) {
        iziToast.error({
            title: "Error",
            message: "Please choose a date in the future",
            position: "topRight",
        });
    }else{
        startBtn.disabled = false;
        startBtn.style.color = "black";
        startBtn.style.border = "2px solid black";
        startBtn.addEventListener("click", () => {
            const timerId = setInterval(() => {
                const currentTime = Date.now();
                const deltaTime = selectedTime - currentTime;
                if (deltaTime <= 0) {
                    clearInterval(timerId);
                    return;
                }
                document.querySelector(".value[data-days]").textContent = String(Math.floor(deltaTime / (1000 * 60 * 60 * 24))).padStart(2, "0");
                document.querySelector(".value[data-hours]").textContent = String(Math.floor((deltaTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0");
                document.querySelector(".value[data-minutes]").textContent = String(Math.floor((deltaTime % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
                document.querySelector(".value[data-seconds]").textContent = String(Math.floor((deltaTime % (1000 * 60)) / 1000)).padStart(2, "0");
                startBtn.disabled = true;
                startBtn.style.color = "#b8b8b8";
                startBtn.style.border = "2px solid #c6c6c6";
                endingTime.disabled = true;
        }, 1000);
        });
    }
  },
};

flatpickr(endingTime, options);