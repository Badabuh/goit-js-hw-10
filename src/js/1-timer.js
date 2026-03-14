import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const endingTime = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const daysValue = document.querySelector('.value[data-days]');
const hoursValue = document.querySelector('.value[data-hours]');
const minutesValue = document.querySelector('.value[data-minutes]');
const secondsValue = document.querySelector('.value[data-seconds]');

let selectedTime = null;
let timerId = null;

function setStartButtonState(isEnabled) {
  startBtn.disabled = !isEnabled;
  startBtn.style.color = isEnabled ? 'black' : '#b8b8b8';
  startBtn.style.border = isEnabled ? '2px solid black' : '2px solid #c6c6c6';
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    selectedTime = selectedDates[0].getTime();
    if (selectedTime <= Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      setStartButtonState(false);
      return;
    } else {
      setStartButtonState(true);
    }
  },
};

setStartButtonState(false);

startBtn.addEventListener('click', () => {
  if (!selectedTime || timerId) {
    return;
  }

  setStartButtonState(false);
  endingTime.disabled = true;

  timerId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = selectedTime - currentTime;

    if (deltaTime <= 0) {
      clearInterval(timerId);
      timerId = null;
      selectedTime = null;
      setStartButtonState(false);
      endingTime.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(deltaTime);
    daysValue.textContent = addLeadingZero(days);
    hoursValue.textContent = addLeadingZero(hours);
    minutesValue.textContent = addLeadingZero(minutes);
    secondsValue.textContent = addLeadingZero(seconds);
  }, 1000);
});

flatpickr(endingTime, options);
