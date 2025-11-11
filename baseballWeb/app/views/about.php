<?php
$pageTitle = "2D Baseball | About";
$pageDescription = "About page for 2D Baseball Simulator includes origins and future plans.";

$pageCSS = '<link rel="stylesheet" href="' . $baseUrl . 'public/css/about.css?v=' . time() . '">';
?>
<main class="main-content about-page">
    <header class="about-hero">
        <h1 class="about-title">About <span>2D&nbsp;Baseball<span></h1>
        <p class="about-subtitle">This page is about our company, the 2D Baseball simulator, and future plans for the game and our company.</p>
        <a href="<?php echo $baseUrl; ?>public/images/about/roadmap.png" target="_blank" class="btn-download about-btn">Roadmap</a>
    </header>

    <section class="about-block">
        <div class="about-image">
            <img class="zoomable" src="<?php echo $baseUrl; ?>public/images/about/1-block.png" alt="Origins of the Game">
        </div>
        <div class="about-text">
            <h2>Game Origins</h2>
            <p>2D Baseball started as a small project that I began creating during the holidays in my free time out of a passion for programming. What started as a simple concept has evolved into a growing simulator with realistic mechanics and unique gameplay. Currently, the game allows you to try pitching, batting, throwing, stealing bases, etc. Unfortunately, for now there is only a version against an AI opponent.</p>
        </div>
    </section>

    <section class="about-block reverse">
        <div class="about-image">
            <img class="zoomable" src="<?php echo $baseUrl; ?>public/images/about/2-block.png" alt="Gameplay Features">
        </div>
        <div class="about-text">
            <h2>Future Enhancements</h2>
            <p>In the future, we would like to expand the game into a full-fledged 2D Baseball, where you could play in various leagues, from the least known ones to the Major League itself. You would be able to choose a team to play for, or create your own team with your own players!<br>
            This will be possible if the game becomes popular and it makes sense to expand the game in this way.</p>
        </div>
    </section>

    <section class="about-block">
        <div class="about-image">
            <img class="zoomable" src="<?php echo $baseUrl; ?>public/images/about/3-block.png" alt="Community & Engagement">
        </div>
        <div class="about-text">
            <h2>Future Plans For Company</h2>
            <p>We have big plans for our community, specifically, if we succeed in this game format, we would like to rename the company 2D Baseball to 2D Sports and develop all possible kinds of sports in a 2D pixel art interface. For example, soccer, American football, hockey, basketball, and many more!</p>
        </div>
    </section>

    <div id="lightbox" class="lightbox">
        <span class="lightbox-close">&times;</span>
        <img class="lightbox-content" id="lightbox-img">
    </div>
</main>

<script>
document.addEventListener("DOMContentLoaded", function() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".lightbox-close");

    document.querySelectorAll(".zoomable").forEach(img => {
        img.addEventListener("click", function() {
            lightboxImg.src = this.src;
            lightbox.classList.add("show");
        });
    });

    closeBtn.addEventListener("click", () => {
        lightbox.classList.remove("show");
    });

    lightbox.addEventListener("click", function(e) {
        if(e.target === this) lightbox.classList.remove("show");
    });
});

</script>

