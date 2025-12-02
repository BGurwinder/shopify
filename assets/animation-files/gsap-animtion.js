//   document.addEventListener('DOMContentLoaded', function () {
//     gsap.registerPlugin(ScrollTrigger);

//     gsap.utils.toArray('.section--page-width').forEach((card) => {
//       gsap.from(card, {
//         opacity: 0.6,
//         color: '#00000',
//         y: 70,
//         duration: 2,

//         ease: 'power2.out',
//         scrollTrigger: {
//           trigger: card,
//           start: 'top 98%',
//           scrub: true,
//           toggleActions: 'play play reverse reverse',
//         },
//       });
//     });
//   });

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const splitTypes = document.querySelectorAll(".big-text-content p");

  splitTypes.forEach((element) => {
    const bg = element.dataset.bgColor || "#568c24";
    const fg = element.dataset.fgColor || " #063215FF";

    // Split text into both words and chars
    const text = new SplitType(element, { types: "words, chars" });

    // Animate by word to prevent breaking words across lines
    gsap.fromTo(
      text.words,
      { y: 20, opacity: 0, color: bg },
      {
        y: 0,
        opacity: 1,
        color: fg,
        duration: 0.5,
        stagger: 0.05,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "top 30%",
          scrub: true,
          toggleActions: "play play reverse reverse",
        },
      }
    );
  });

  // Initialize Lenis (smooth scrolling)
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
});

// document.addEventListener('DOMContentLoaded', () => {
//   // Select all elements you want to animate
//   const medias = document.querySelectorAll('deferred-media');

//   medias.forEach((media) => {
//     gsap.fromTo(
//       media,
//       { y: 50, scale: 0.6 , borderRadius:"100px",},
//       {
//         y: 0,
//         scale: 1,
//         borderRadius:"30px",
//         duration: 0.5,

//         stagger: 0.05,
//         scrollTrigger: {
//           trigger: media,
//           start: 'top 80%',
//           end: 'top 50%',
//           scrub: true,
//           toggleActions: 'play play reverse reverse',
//         },
//       }
//     );
//   });
// });
