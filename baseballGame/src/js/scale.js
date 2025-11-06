let gameScale = 1;

function scaleGame() { 
    const wrapper = document.querySelector('.gameWrapper'); 
    const maxWidth = 1100; 
    const maxHeight = 810;

    const scaleX = window.innerWidth / maxWidth; 
    const scaleY = window.innerHeight / maxHeight; 

    gameScale = Math.min(scaleX, scaleY, 1);

    wrapper.style.transform = `scale(${gameScale})`;
    wrapper.style.width = `${maxWidth}px`;
    wrapper.style.height = `${maxHeight}px`;
}

// spustit při načtení 
window.addEventListener('load', scaleGame); 
// spustit při změně velikosti okna 
window.addEventListener('resize', scaleGame);