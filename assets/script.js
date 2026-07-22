/* Interactions — Bryan Martinez Ostéopathe */
(function () {
  "use strict";

  var doux = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Menu mobile --- */
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var ouvert = nav.classList.toggle("ouvert");
      burger.setAttribute("aria-expanded", ouvert ? "true" : "false");
      burger.setAttribute("aria-label", ouvert ? "Fermer le menu" : "Ouvrir le menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("ouvert");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* --- Éléments pilotés par le défilement --- */
  var entete = document.querySelector(".entete");
  var barre = document.querySelector(".progression");
  var scene = document.querySelector(".hero-plein .hero-scene");
  var invite = document.querySelector(".hero-invite");
  var plein = document.querySelector(".hero-plein");
  var tick = false;

  function surDefilement() {
    var y = window.scrollY || window.pageYOffset;

    if (entete) entete.classList.toggle("colle", y > 8);

    if (barre) {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      barre.style.transform = "scaleX(" + (total > 0 ? Math.min(1, y / total) : 0) + ")";
    }

    // Héro plein écran : la scène se rétracte pour laisser apparaître le site
    if (scene && plein && !doux && window.innerWidth > 900) {
      var h = plein.offsetHeight || 1;
      var p = Math.min(1, Math.max(0, y / h));
      var e = p * p * (3 - 2 * p); // lissage
      scene.style.transform = "scale(" + (1 - e * 0.30) + ")";
      scene.style.borderRadius = (e * 56) + "px";
      scene.style.opacity = (1 - e * 0.30).toFixed(3);
      if (invite) invite.style.opacity = (1 - Math.min(1, p * 3)).toFixed(3);
    }
    tick = false;
  }

  window.addEventListener("scroll", function () {
    if (!tick) { tick = true; window.requestAnimationFrame(surDefilement); }
  }, { passive: true });
  surDefilement();

  /* --- Apparition progressive --- */
  var cibles = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || doux) {
    cibles.forEach(function (el) { el.classList.add("vu"); });
  } else {
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("vu"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    cibles.forEach(function (el) { obs.observe(el); });

    // Décalage automatique dans les grilles, pour un enchaînement plus vivant
    document.querySelectorAll(".grille, .flottants").forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (el, i) {
        if (el.classList.contains("reveal")) {
          el.style.transitionDelay = Math.min(i * 0.07, 0.42) + "s";
        }
      });
    });
  }
})();
