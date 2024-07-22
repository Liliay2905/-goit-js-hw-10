import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('start');
  const dateTimePicker = document.getElementById('datetime-picker');
  const timerDisplay = document.getElementById('timer');
  let countdownInterval;

  flatpickr(dateTimePicker, {
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
    onClose: function (selectedDates) {
      const selectedDate = selectedDates[0];
      if (selectedDate <= new Date()) {
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
        });
        startButton.disabled = true;
      } else {
        startButton.disabled = false;
      }
    },
  });

  function formatTime(value) {
    return String(value).padStart(2, '0');
  }

  function updateTimer(endTime) {
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      timerDisplay.textContent = '00:00:00:00';
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    timerDisplay.textContent = `${formatTime(days)}:${formatTime(
      hours
    )}:${formatTime(minutes)}:${formatTime(seconds)}`;
  }

  startButton.addEventListener('click', function () {
    const selectedDate = new Date(dateTimePicker.value);
    if (selectedDate > new Date()) {
      startButton.disabled = true;
      clearInterval(countdownInterval);
      updateTimer(selectedDate);
      countdownInterval = setInterval(() => {
        updateTimer(selectedDate);
      }, 1000);
    }
  });
});
