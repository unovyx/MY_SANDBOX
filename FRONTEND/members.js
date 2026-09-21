/* AUTH CHECK */

const authToken =
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

if (!authToken) {
    window.location.replace("index.html");
}


/* MEMBERS PAGE */

document.addEventListener("DOMContentLoaded", () => {
    /* LOADING */

    const plantLoader = document.getElementById("plantLoader");

    /* LOADING ELEMENTS */

    const loadingPercent = document.getElementById("loadingPercent");
    const loadingProgressBar = document.getElementById("loadingProgressBar");
    const loadingStatus = document.getElementById("loadingStatus");
    const loadingMessage = document.getElementById("loadingMessage");

    /* MEMBERS */

    const memberCards = document.querySelectorAll(".member-card");

    /* NAVIGATION */

    const navLinks = document.querySelectorAll(".nav-link");
    const pageSections = document.querySelectorAll("#home, #members, #about");

    /* MEMBER MODAL */

    const memberModal = document.getElementById("memberModal");
    const modalClose = document.getElementById("modalClose");
    const modalImage = document.getElementById("modalImage");
    const modalNumber = document.getElementById("modalNumber");
    const modalDisplay = document.getElementById("modalDisplay");
    const modalRole = document.getElementById("modalRole");
    const modalName = document.getElementById("modalName");
    const modalAge = document.getElementById("modalAge");
    const modalStatus = document.getElementById("modalStatus");
    const modalEmail = document.getElementById("modalEmail");
    const modalContribution = document.getElementById("modalContribution");
    const modalStatement = document.getElementById("modalStatement");
    const modalStatusText = document.getElementById("modalStatusText");

    /* EXIT MODAL */

    const logoutButton = document.getElementById("logoutButton");
    const logoutModal = document.getElementById("logoutModal");
    const cancelLogout = document.getElementById("cancelLogout");
    const confirmLogout = document.getElementById("confirmLogout");

    /* INITIAL PAGE STATE */

    document.body.style.overflow = "hidden";

    /* LOADING PROCESS */

    let progress = 0;

    const loadingMessages = [
        {
            percent: 8,
            status: "WAKING UP SANDBOX...",
            message: "TRYING TO LOOK PRODUCTIVE..."
        },
        {
            percent: 22,
            status: "LOADING PROJECT 441...",
            message: "LOCATING THE PEOPLE RESPONSIBLE..."
        },
        {
            percent: 38,
            status: "CHECKING SYSTEM FILES...",
            message: "NO OBVIOUS PROBLEMS DETECTED."
        },
        {
            percent: 54,
            status: "INITIALIZING PERSONALITIES...",
            message: "ANXIETY HAS ENTERED THE SYSTEM."
        },
        {
            percent: 69,
            status: "CONNECTING TEAM MEMBERS...",
            message: "ENNUI IS CURRENTLY WATCHING."
        },
        {
            percent: 82,
            status: "PROCESSING DEADLINES...",
            message: "PRESSURE LEVELS: QUESTIONABLE."
        },
        {
            percent: 94,
            status: "FINALIZING DOCUMENTATION...",
            message: "CLOWN HAS THE PAPERWORK."
        },
        {
            percent: 100,
            status: "SANDBOX READY.",
            message: "SOMEHOW, EVERYTHING IS WORKING."
        }
    ];

    function updateLoadingScreen(value) {
        const current = loadingMessages.find(item => value <= item.percent) || loadingMessages[loadingMessages.length - 1];

        loadingPercent.textContent = `${value}%`;
        loadingProgressBar.style.width = `${value}%`;
        loadingStatus.textContent = current.status;
        loadingMessage.textContent = current.message;
    }

    function runLoadingProcess() {
        const totalDuration = 3400;
        const startTime = performance.now();

        function animateLoading(currentTime) {
            const elapsed = currentTime - startTime;
            const rawProgress = Math.min(elapsed / totalDuration, 1);
            const easedProgress = 1 - Math.pow(1 - rawProgress, 2.2);

            progress = Math.floor(easedProgress * 100);

            updateLoadingScreen(progress);

            if (rawProgress < 1) {
                requestAnimationFrame(animateLoading);
            } else {
                updateLoadingScreen(100);

                setTimeout(() => {

                    /* ONLY CHANGE: DIRECTLY HIDE LOADER */

                    plantLoader.style.display = "none";

                    document.body.style.overflow = "auto";

                    /* GO TO HOME */

                    document.getElementById("home").scrollIntoView({
                        behavior: "auto"
                    });

                }, 650);
            }
        }

        requestAnimationFrame(animateLoading);
    }

    updateLoadingScreen(0);
    runLoadingProcess();

    /* DISCOVER MEMBERS */

    const discoverButton = document.getElementById("discoverButton");

    discoverButton.addEventListener("click", () => {
        document.getElementById("members").scrollIntoView({
            behavior: "smooth"
        });
    });

    /* NAVIGATION CLICK */

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");
        });
    });

    /* NAVIGATION ON SCROLL */

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                }

                navLinks.forEach(link => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${entry.target.id}`
                    );
                });
            });
        },
        {
            threshold: 0.45
        }
    );

    pageSections.forEach(section => {
        observer.observe(section);
    });

    /* MEMBER CARD INTERACTION */

    memberCards.forEach(card => {
        const revealButton = card.querySelector(".reveal-button");
        const image = card.querySelector(".personality-image img");

        /* REVEAL REAL MEMBER */

        revealButton.addEventListener("click", event => {
            event.stopPropagation();
            openMember(card);
        });

        /* KEYBOARD ACCESS */

        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openMember(card);
            }
        });

        /* MOUSE MOVEMENT */

        card.addEventListener("mousemove", event => {
            if (window.innerWidth < 760) {
                return;
            }

            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateX = ((y / rect.height) - 0.5) * -3;
            const rotateY = ((x / rect.width) - 0.5) * 3;

            image.style.transform = `scale(0.96) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            image.style.transform = "scale(0.9)";
        });
    });

    /* TEXT CLEANER */

    function cleanText(value) {
        return value.replace(/\s+/g, " ").trim();
    }

    /* OPEN MEMBER */

    function openMember(card) {
        modalNumber.textContent = `RECORD ${card.dataset.number}`;
        modalDisplay.textContent = card.dataset.display;
        modalRole.textContent = card.dataset.role;
        modalName.textContent = card.dataset.name;
        modalAge.textContent = card.dataset.age;
        modalStatus.textContent = card.dataset.status;
        modalEmail.textContent = card.dataset.email;
        modalContribution.textContent = cleanText(card.dataset.contribution);
        modalStatement.textContent = `“${cleanText(card.dataset.statement)}”`;
        modalStatusText.textContent = card.dataset.status;
        modalImage.src = card.dataset.image;
        modalImage.alt = `${card.dataset.name} — ${card.dataset.display}`;

        memberModal.classList.add("open");
        memberModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        modalClose.focus();
    }

    /* CLOSE MEMBER */

    function closeMember() {
        memberModal.classList.remove("open");
        memberModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        modalImage.removeAttribute("src");
    }

    modalClose.addEventListener("click", closeMember);

    memberModal.addEventListener("click", event => {
        if (event.target === memberModal) {
            closeMember();
        }
    });

    /* LOGOUT MODAL */

    logoutButton.addEventListener("click", () => {
        logoutModal.classList.add("open");
        logoutModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
    });

    function closeLogout() {
        logoutModal.classList.remove("open");
        logoutModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    }

    cancelLogout.addEventListener("click", closeLogout);

    logoutModal.addEventListener("click", event => {
        if (event.target === logoutModal) {
            closeLogout();
        }
    });

    confirmLogout.addEventListener("click", () => {

        /* CLEAR LOGIN */

        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        /* RETURN TO LOGIN */

        window.location.replace("index.html");
    });

    /* ESC KEY */

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") {
            return;
        }

        if (memberModal.classList.contains("open")) {
            closeMember();
        }

        if (logoutModal.classList.contains("open")) {
            closeLogout();
        }
    });
});