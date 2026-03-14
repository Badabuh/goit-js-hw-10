import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const endingTime = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');

let selectedTime = null;

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
    if (selectedTime < Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      return;
    } else {
      startBtn.disabled = false;
      startBtn.style.color = 'black';
      startBtn.style.border = '2px solid black';
    }
  },
};
startBtn.addEventListener('click', () => {
  const timerId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = selectedTime - currentTime;
    if (deltaTime <= 0) {
      clearInterval(timerId);
      selectedTime = null;
      startBtn.disabled = false;
      startBtn.style.color = 'black';
      startBtn.style.border = '2px solid black';
      endingTime.disabled = false;
      return;
    }
    const { days, hours, minutes, seconds } = convertMs(deltaTime);
    document.querySelector('.value[data-days]').textContent =
      addLeadingZero(days);
    document.querySelector('.value[data-hours]').textContent =
      addLeadingZero(hours);
    document.querySelector('.value[data-minutes]').textContent =
      addLeadingZero(minutes);
    document.querySelector('.value[data-seconds]').textContent =
      addLeadingZero(seconds);
    startBtn.disabled = true;
    startBtn.style.color = '#b8b8b8';
    startBtn.style.border = '2px solid #c6c6c6';
    endingTime.disabled = true;
  }, 1000);
});

flatpickr(endingTime, options);
