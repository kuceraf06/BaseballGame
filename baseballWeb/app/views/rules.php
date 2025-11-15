<?php
$pageTitle = "2D Baseball | Rules";
$pageDescription = "Official baseball rules simplified for beginners — gameplay, scoring, and structure.";

$pageCSS = '<link rel="stylesheet" href="' . $baseUrl . 'public/css/rules.css?v=' . time() . '">';
?>

<main class="main-content rules-page">
    <section class="rules-hero">
        <div class="rules-hero-inner">
            <h1>Baseball <span>Rules</span></h1>
           
        </div> <p>Learn how the game really works — from innings to strikes, bases, and scoring runs.</p>
    </section>

    <section class="rules-intro">
        <h2>The Essence of the Game</h2>
        <p>Baseball is a battle between offense and defense. The batting team tries to score runs by hitting and running bases, while the defending team prevents them by catching, throwing, and outsmarting the runners. The game is played in nine innings, and every pitch counts.</p>
    </section>

    <section class="rules-timeline">
        <div class="rule-step">
            <div class="rule-number">1</div>
            <div class="rule-content">
                <h3>The Field</h3>
                <p>The field is a diamond with four bases forming a square. Players move counterclockwise: from home plate to first, second, third, and back home to score a run.</p>
            </div>
        </div>

        <div class="rule-step">
            <div class="rule-number">2</div>
            <div class="rule-content">
                <h3>Pitching & Batting</h3>
                <p>The pitcher throws the ball toward the batter. Three strikes and you're out — four balls and you walk to first base.</p>
            </div>
        </div>

        <div class="rule-step">
            <div class="rule-number">3</div>
            <div class="rule-content">
                <h3>Running & Outs</h3>
                <p>Runners sprint from base to base. Fielders can tag them or throw to a base to get them out. Three outs per half-inning.</p>
            </div>
        </div>

        <div class="rule-step">
            <div class="rule-number">4</div>
            <div class="rule-content">
                <h3>Scoring</h3>
                <p>When a runner reaches home plate, a run is scored. Home runs automatically bring all players home. Most runs after nine innings wins.</p>
            </div>
        </div>
    </section>

    <section class="rules-cards">
        <div class="rule-card">
            <img src="<?php echo $baseUrl; ?>public/images/rules/pitching.png" class="first" alt="Batting Icon">
            <h3>Strike Zone</h3>
            <p>The area over home plate where a pitched ball must pass to be called a strike. The size depends on the batter’s height.</p>
        </div>

        <div class="rule-card">
            <img src="<?php echo $baseUrl; ?>public/images/rules/fielding.png" class="second" alt="Fielding Icon">
            <h3>Field Positions</h3>
            <p>There are nine defensive positions — including pitcher, catcher, infielders, and outfielders. Each has a unique role in preventing runs.</p>
        </div>

        <div class="rule-card">
            <img src="<?php echo $baseUrl; ?>public/images/rules/hitting.png" class="third" alt="Base Icon">
            <h3>Base Running</h3>
            <p>Runners must touch each base in order. If tagged before reaching it, they’re out. Timing and awareness are key to advancing safely.</p>
        </div>
    </section>

    <section class="sim-rules">
        <div class="sim-header">
            <h2>Simulation Rules</h2>
            <p>These rules apply only to the training simulator and differ from a real baseball game.</p>
        </div>

        <div class="sim-rule-list">

            <div class="sim-rule-item">
                <h3>Not a Full Match</h3>
                <p>The simulator focuses on training. It’s not a full 9–inning game — only the final inning is played.</p>
            </div>

            <div class="sim-rule-item">
                <h3>No Field Outs</h3>
                <p>Fielders can’t catch or throw players out. The only possible outs are strikeouts.</p>
            </div>

            <div class="sim-rule-item">
                <h3>No Teams</h3>
                <p>There are no full teams. You only practice pitching and hitting individually.</p>
            </div>

            <div class="sim-rule-item">
                <h3>Training-Focused</h3>
                <p>The goal is to improve timing, accuracy, and reaction.</p>
            </div>

        </div>
    </section>
</main>
