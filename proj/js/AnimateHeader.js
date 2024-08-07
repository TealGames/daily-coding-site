
(function animateTitle() {
    const $animatingIdentifier = $("#title-char-identifier");
    const onTransTime = 0.5;
    const offTransTime = 0.5;

    $animatingIdentifier.css("opacity");
    //animationDecision();

    function animationDecision() {
        if ($animatingIdentifier.css("opacity") < 0.01) {
            $animatingIdentifier.animate({
                opacity: "1",
            }, onTransTime * 1000, animationDecision);
        }
        else {
            $animatingIdentifier.animate({
                opacity: "0",
            }, offTransTime * 1000, animationDecision);
        }
    }
}());
