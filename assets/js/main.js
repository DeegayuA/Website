
/*===== SHOW MENU =====*/
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('show-menu')
    })
  }
}
showMenu('nav-toggle', 'nav-menu')
/*===== REMOVE MENU MOBILE =====*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
  const navMenu = document.getElementById('nav-menu')
  navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))
/*===== SCROLL SECTIONS ACTIVE LINK =====*/
const sections = document.querySelectorAll('section[id]')
function scrollActive() {
  const scrollY = window.pageYOffset

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight
    const sectionTop = current.offsetTop - 50
    sectionId = current.getAttribute('id')

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
    } else {
      document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
    }
  })
}
window.addEventListener('scroll', scrollActive)

/*===== CHANGE BACKGROUND HEADER =====*/
function scrollHeader() {
  const header = document.getElementById('header')
  if (this.scrollY >= 200) header.classList.add('scroll-header'); else header.classList.remove('scroll-header'); S
}
window.addEventListener('scroll', scrollHeader)

/*===== SHOW SCROLL TOP =====*/
function scrollTop() {
  const scrollTop = document.getElementById('scroll-top')
  if (this.scrollY >= 500) scrollTop.classList.add('show-scroll'); else scrollTop.classList.remove('show-scroll');
}
window.addEventListener('scroll', scrollTop)

/*===== MIXITUP FILTER PORTFOLIO =====*/
var mixer = mixitup('.portfolio__container', {
  selectors: {
    target: '.portfolio__content'
  },
  animation: {
    duration: 400
  }
});
/* Link active portfolio */
const linkPortfolio = document.querySelectorAll('.portfolio__item')

function activePortfolio() {
  if (linkPortfolio) {
    linkPortfolio.forEach(l => l.classList.remove('active-portfolio'))
    this.classList.add('active-portfolio')
  }
}
linkPortfolio.forEach(l => l.addEventListener('click', activePortfolio))

/*===== SWIPERjs.com copied =====*/
const swiper = new Swiper('.testimonial__container', {
  // Optional parameters
  spaceBetween: 24,
  direction: 'horizontal',
  loop: true,
  grabCursor: true,
  mousewheel: true,
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    dynamicBullets: true,
    clickable: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
  effect: 'slide',
  scrollbar: {
    el: '.swiper-scrollbar',
  },
  autoplay: {
    delay: 1000,
    disableOnInteraction: true,
    pauseOnMouseEnter: true,
  },
});
/*===== dark mode =====*/
let darkMode = localStorage.getItem('darkMode');
{
  const darkModeToggle = document.querySelector('#dark-mode-toggle');

  const enableDarkMode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkMode', 'enabled');
  }

  const disableDarkMode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkMode', null);
  }

  if (darkMode === 'enabled') {
    enableDarkMode();
  }

  darkModeToggle.addEventListener('click', () => {
    darkMode = localStorage.getItem('darkMode');
    if (darkMode !== 'enabled') {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  });
}

/*===== Custom mouse =====*/
if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
  // paralex animation

  var scene = document.getElementById('scene');
  var parallaxInstance = new Parallax(scene, {
    relativeInput: true
  });
  /*===== Mouse =====*/
  (function () {
    // mouse move function
    var cursor = document.querySelector('.cursor');
    var links = document.querySelectorAll('a');
    var images = document.querySelectorAll('img');
    var texts = document.querySelectorAll('span, p, li, h1, h2, h3, h4, h5, h6, text, input, textarea');

    var editCursor = function editCursor(event) {
      cursor.style.left = event.clientX + 'px';
      cursor.style.top = event.clientY + 'px';
    }

    window.addEventListener('mousemove', editCursor);
    // link hovering part
    links.forEach(link => {
      link.addEventListener("mouseleave", () => {
        cursor.classList.remove("link__hover");
      });
      link.addEventListener("mouseover", () => {
        cursor.classList.add("link__hover");
      });
    });
    texts.forEach(text => {
      text.addEventListener("mouseleave", () => {
        cursor.classList.remove("text__hover");
      });
      text.addEventListener("mouseover", () => {
        cursor.classList.add("text__hover");
      });
    });
    images.forEach(image => {
      image.addEventListener("mouseleave", () => {
        cursor.classList.remove("img__hover");
      });
      image.addEventListener("mouseover", () => {
        cursor.classList.add("img__hover");
      });
    });
    // click 
    window.addEventListener("click", () => {
      if (cursor.classList.contains("click")) {
        cursor.classList.remove("click");
        void cursor.offsetWidth; // trigger a DOM reflow
        cursor.classList.add("click");
      } else {
        cursor.classList.add("click");
      }
    });
  })();
}

/*===== GSAP ANIMATIONS =====*/
document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(
    Flip,
    ScrollTrigger,
    Observer,
    ScrollToPlugin,
    Draggable,
    MotionPathPlugin,
    EaselPlugin,
    PixiPlugin,
    TextPlugin,
    RoughEase,
    ExpoScaleEase,
    SlowMo,
    CustomEase
  );

  if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    document.addEventListener("DOMContentLoaded", function () {
      // Select the loader element
      var loader = document.querySelector('.loader.skeleton2');

      // Hide the loader initially
      loader.style.display = 'none';

      // Show the loader after a delay
      setTimeout(function () {
        loader.style.display = 'block';
      }, 1);
    });

    // INTRO ANIMATION
    const introTL = gsap.timeline({  // Create a named timeline for clarity
      delay: 1.5, // Delay the entire intro animation sequence
      defaults: { duration: 2, ease: 'expo.out' } // Common defaults
    });

    introTL
      .from('.home__data, .home__greeting, .home__profession, .home__name', { y: 20, opacity: 0, stagger: 0.3 })
      .from('.home__img', { x: 60, opacity: 0 }, '-=1.5') // Overlap with previous animations
      .from('.new-text, .time-format, .button-light', { y: 20, opacity: 0, stagger: 0.3 }, '-=1.5')
      .from('.nav__logo, .nav__toggle, .nav__item, .home__social-icon', { y: 20, opacity: 0, stagger: 0.2 }, '-=2');


// SKELETON LOADING ANIMATION
gsap.timeline({ repeat: -1, repeatDelay: 0}) // Repeat indefinitely
  .from('.skeleton2, .skeleton', {
    duration: 0.5,
    opacity: 0,
    ease: 'power1.inOut',
    stagger: 0.07,
    delay: 0.5,
  })
  .to('.skeleton', {
    duration: 1,
    opacity: 0,
    stagger: 0.07,
    ease: 'power1.inOut',
  }, '-=0.5') // Delay the start of the fade-out animation for .skeleton elements
  .to('.skeleton2', {
    duration: 1,
    opacity: 0,
    stagger: 0.05,
    ease: 'power1.inOut',
  }, '-=0.5'); // Delay the start of the fade-out animation for .skeleton2 elements


    // Fade out the loading animation 3 seconds after the window is fully loaded
    window.onload = function () {
      setTimeout(() => {
        gsap.to('.skeleton, .skeleton2', {
          duration: 0.5,
          opacity: 0,
          onComplete: function () {
            document.body.classList.add('loaded');
          }
        });
      }, 3000); // Delay execution by 3 seconds
    };




    // ***** SCROLL ANIMATIONS *****
    ScrollTrigger.matchMedia({
      "(min-width: 576px)": function () {
        gsap.to(".did-you-know", {
          pinReparent: true,
          scrollTrigger: {
            pin: ".about__img",
            endTrigger: ".did-you-know",
            start: "top 20%",
            end: "top bottom"
          }
        })
      },

      "all": function () {
        gsap.from(".about__img", {
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: ".about__img",
            toggleActions: "play pause play reset",
            start: "top 60%",
            end: "bottom bottom",
            scrub: 2
          }
        });

        // Headings Fade (Optimized)
        gsap.from(".section-title, .section-subtitle", {
          opacity: 0,
          y: -50,
          delay: 0.25,
          duration: 0.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".section-title, .section-subtitle", // Target all at once
            start: "top 80%",
            end: "top 60%",
            scrub: 1
          }
        });

        // Generic Section Fade-in
        ScrollTrigger.batch(".section", {
          onEnter: (elements) => { // Batching handles elements together
            gsap.from(elements, {
              opacity: 0,
              stagger: 0.25,
              ease: "power1.inOut",
              delay: 0.25,
              scrollTrigger: {
                trigger: elements[0],
                start: "top 70%",
                end: "top 50%",
                scrub: 2,
              },
              duration: 0.6
            });
          }
        });
      }
    });
  }
});


// Function to check screen width and add/remove class accordingly
function toggleClassBasedOnScreenWidth() {
  var screenWidth = window.innerWidth;
  var elements = document.querySelectorAll('.computer-only');

  for (var i = 0; i < elements.length; i++) {
    if (screenWidth > 1024) {
      elements[i].classList.add('show');
    } else {
      elements[i].classList.remove('show');
    }
  }
}

// Initial call to set classes based on screen width
toggleClassBasedOnScreenWidth();

// Add event listener for window resize
window.addEventListener('resize', function () {
  toggleClassBasedOnScreenWidth();
});


