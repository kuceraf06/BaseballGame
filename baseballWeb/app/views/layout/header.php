<header class="main-header">
    <div class="container">
        <a href="<?= $baseUrl ?>" class="logo">
            <img src="<?= $baseUrl ?>public/images/header/logo.png" alt="Logo">
        </a>

        <nav class="main-nav" id="mainNav">
            <ul>
                <li><a href="about">About</a></li>
                <li><a href="how-to-play">How&nbsp;to&nbsp;play</a></li>
                <li><a href="rules">Rules</a></li>
                <li><a href="leaderboard">Leaderboard</a></li>
                <li><a href="support">Support</a></li>
                <li><a href="info">Info</a></li>
            </ul>
        </nav>

        <div class="header-right">
            <a href="signIn.php" class="btn-signIn">Sign&nbsp;In</a>
            <a href="download.php" class="btn-download">Download</a>
        </div>
        
        <button class="hamburger" id="hamburgerBtn">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</header>

<script>
    const hamburger = document.getElementById("hamburgerBtn");
    const nav = document.getElementById("mainNav");
    const body = document.body;
    const html = document.documentElement;

    hamburger.addEventListener("click", () => {
        const isActive = nav.classList.toggle("active");
        hamburger.classList.toggle("active");

        if (isActive) {
            html.classList.add("no-scroll");
            body.classList.add("no-scroll");
            window.scrollTo(0, 0);
        } else {
            html.classList.remove("no-scroll");
            body.classList.remove("no-scroll");
        }
    });
</script>
