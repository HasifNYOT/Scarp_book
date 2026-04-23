let highestZ = 1;

class Paper {
    // --- Shared ---
    holdingPaper = false;
    currentPaperX = 0;
    currentPaperY = 0;
    rotation = Math.random() * 30 - 15;

    // --- Desktop ---
    prevMouseX = 0;
    prevMouseY = 0;
    mouseX = 0;
    mouseY = 0;
    velocityX = 0;
    velocityY = 0;

    // --- Mobile ---
    touchStartX = 0;
    touchStartY = 0;
    touchMoveX = 0;
    touchMoveY = 0;
    prevTouchX = 0;
    prevTouchY = 0;
    velX = 0;
    velY = 0;
    rotating = false;

    init(paper) {

        // =====================
        // DESKTOP - Mouse Events
        // =====================
        paper.addEventListener('mousedown', (e) => {
            this.holdingPaper = true;
            paper.style.zIndex = highestZ;
            highestZ += 1;

            if (e.button === 0) {
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
            }
        });

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            this.velocityX = this.mouseX - this.prevMouseX;
            this.velocityY = this.mouseY - this.prevMouseY;

            if (this.holdingPaper) {
                this.currentPaperX += this.velocityX;
                this.currentPaperY += this.velocityY;

                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;

                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
            }
        });

        window.addEventListener('mouseup', () => {
            this.holdingPaper = false;
        });

        // =====================
        // MOBILE - Touch Events
        // =====================
        paper.addEventListener('touchstart', (e) => {
            if (this.holdingPaper) return;
            this.holdingPaper = true;

            paper.style.zIndex = highestZ;
            highestZ += 1;

            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.prevTouchX = this.touchStartX;
            this.prevTouchY = this.touchStartY;
        });

        paper.addEventListener('touchmove', (e) => {
            e.preventDefault();

            if (!this.rotating) {
                this.touchMoveX = e.touches[0].clientX;
                this.touchMoveY = e.touches[0].clientY;

                this.velX = this.touchMoveX - this.prevTouchX;
                this.velY = this.touchMoveY - this.prevTouchY;
            }

            const dirX = e.touches[0].clientX - this.touchStartX;
            const dirY = e.touches[0].clientY - this.touchStartY;
            const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
            const dirNormalizedX = dirX / dirLength;
            const dirNormalizedY = dirY / dirLength;

            const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
            let degrees = 180 * angle / Math.PI;
            degrees = (360 + Math.round(degrees)) % 360;

            if (this.rotating) {
                this.rotation = degrees;
            }

            if (this.holdingPaper) {
                if (!this.rotating) {
                    this.currentPaperX += this.velX;
                    this.currentPaperY += this.velY;
                }
                this.prevTouchX = this.touchMoveX;
                this.prevTouchY = this.touchMoveY;

                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
            }
        }, { passive: false });

        paper.addEventListener('touchend', () => {
            this.holdingPaper = false;
            this.rotating = false;
        });

        // Two finger rotation on mobile
        paper.addEventListener('gesturestart', (e) => {
            e.preventDefault();
            this.rotating = true;
        });
        paper.addEventListener('gestureend', () => {
            this.rotating = false;
        });
    }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);
});