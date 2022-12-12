
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
  if (this.scrollY >= 100) header.classList.add('scroll-header'); else header.classList.remove('scroll-header'); S
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
{
  let darkMode = localStorage.getItem('darkMode');
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

/*===== GSAP intro ANIMATION =====*/
if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
  gsap.from('.home__data', { opacity: 0, duration: 2, delay: 1.5, y: 20 })
  gsap.from('.home__img', { opacity: 0, duration: 2, delay: 1.75, x: 60 })
  gsap.from('.home__greeting, .home__profession', { opacity: 0, duration: 2, delay: 2, y: 20, ease: 'expo.out', stagger: .4 })
  gsap.from('.new-text, .time-format', { opacity: 0, duration: 2, delay: 3, y: 20, ease: 'expo.out', stagger: .3 })
  gsap.from('.button-light', { opacity: 0, duration: 2, delay: 4.5, y: 20, ease: 'expo.out', stagger: .3 })
  gsap.from('.home__name', { opacity: 0, duration: 2, delay: 2.3, y: 20, ease: 'expo.out', stagger: .3 })
  gsap.from('.nav__logo, .nav__toggle', { opacity: 0, duration: 2, delay: 2.4, y: 20, ease: 'expo.out', stagger: .3 })
  gsap.from('.nav__item', { opacity: 0, duration: 2, delay: 2.6, y: 20, ease: 'expo.out', stagger: .3 })
  gsap.from('.home__social-icon', { opacity: 0, duration: 2, delay: 3, y: 20, ease: 'expo.out', stagger: .3 })
}

/*===== GSAP scroll ANIMATION =====*/

if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
  ScrollTrigger.matchMedia({
    "(min-width:576px)": function () {
      /*===== pinned image =====*/
      gsap.to(".did-you-know", {
        pinReparent: true,
        scrollTrigger: {
          pin: ".about__img",
          endTrigger: ".did-you-know",
          start: "top 20%",
          end: "top bottom",
        }
      })
      /*===== pinned next =====*/
    },

    "all": function () {
      /*===== image fade =====*/
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(".about__img", {
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".about__img",
          toggleActions: "play pause play reset",
          start: "top 60%",
          end: "bottom bottom",
          scrub: 2,
          stagger: .5,
        }
      });
      /*===== headings fade =====
     let headings = gsap.utils.toArray(".section-title, .section-subtitle");
 
     headings.forEach(function (element, index) {
       gsap.from(element, {
         opacity: 0,
         y: -50,
         delay: 0.25,
         duration: .5,
         ease: "power2.inOut",
         scrollTrigger: {
           trigger: element[0],
           start: "top 80%",
           end: "top 60%",
           scrub: 1,
           stagger: 2,
         }
       });
     });
     */
      /*===== section =====*/
      ScrollTrigger.batch(".section", {
        onEnter: (elements, triggers) => {
          gsap.from(elements, {
            ease: "power1.inOut",
            delay: 0.25,
            opacity: 0,
            stagger: 0.25,
            toggleActions: "play none none none",
            scrollTrigger: {
              trigger: elements[0],
              start: "top 70%",
              end: "top 50%",
              scrub: 2,
            },
            duration: 0.6,
          });
        }
      });

    }
  });
}
