
let home_card = new Swiper(".card__content", {
  loop: true,
  spaceBetween: 28,
  grabCursor: true,

  breakpoints:{
    600: {
      slidesPerView: 2,
    },
    1239: {
      slidesPerView: 3,
    },
  },
});

let weekly_card = new Swiper(".weekly__card__content", {
  loop: true,
  spaceBetween: 50,
  grabCursor: true,

  breakpoints:{
    600: {
      slidesPerView: 2,
    },
    1239: {
      slidesPerView: 3,
    },
  },
});

let recentSearch_card = new Swiper(".world__card", {
  loop: true,
  spaceBetween: 20,
  grabCursor: true,

  breakpoints:{
    600: {
      slidesPerView: 2,
    },
    968: {
      slidesPerView: 4,
    },
  },
});

document.addEventListener("DOMContentLoaded", function() {
  const todayBtn = document.querySelector('.today__heading');
  const tomorrowBtn = document.querySelector('.tomorrow__heading');
  const todaySection = document.querySelector('.today');
  const tomorrowSection = document.querySelector('.tomorrow');

  todayBtn.addEventListener('click', function() {
    todaySection.style.display = 'block';
    tomorrowSection.style.display = 'none';
    todayBtn.style.color = 'orange';
    tomorrowBtn.style.color = '#000';
  });

  tomorrowBtn.addEventListener('click', function() {
    todaySection.style.display = 'none';
    tomorrowSection.style.display = 'block';
    tomorrowBtn.style.color = 'orange';
    todayBtn.style.color = '#000';
  });
});

function showOverlay(element) {
  var overlay = element.querySelector('.overlay_details');
  overlay.style.bottom = "0";
  overlay.style.display = "block";
}

function hideOverlay(element) {
  var overlay = element.querySelector('.overlay_details');
  overlay.style.bottom = "-100%";
  overlay.style.display = "none";
}

