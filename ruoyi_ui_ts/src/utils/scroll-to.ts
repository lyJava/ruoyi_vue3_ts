declare global {
    interface Window {
        webkitRequestAnimationFrame?: typeof window.requestAnimationFrame;
        mozRequestAnimationFrame?: typeof window.requestAnimationFrame;
    }
    interface Math {
        easeInOutQuad(t: number, b: number, c: number, d: number): number;
    }
}

Math.easeInOutQuad = function (t: number, b: number, c: number, d: number): number {
    t /= d / 2;
    if (t < 1) {
        return (c / 2) * t * t + b;
    }
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
};

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
const requestAnimFrame = (function (): (callback: () => void) => number {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback: () => void): number {
            return window.setTimeout(callback, 1000 / 60);
        }
    );
})();

/**
 * Because it's so difficult to detect the scrolling element, move them all
 * @param {number} amount
 */
function move(amount: number): void {
    document.documentElement.scrollTop = amount;
    (document.body.parentNode as HTMLElement).scrollTop = amount;
    document.body.scrollTop = amount;
}

function position(): number {
    return (
        document.documentElement.scrollTop ||
        (document.body.parentNode as HTMLElement).scrollTop ||
        document.body.scrollTop
    );
}

/**
 * @param {number} to - The target scroll position
 * @param {number} [duration=500] - Animation duration in milliseconds
 * @param {Function} [callback] - Callback function to execute after animation
 */
export const scrollTo = (to: number, duration: number = 500, callback?: () => void): void => {
    const start = position();
    const change = to - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = () => {
        currentTime += increment;
        const val = Math.easeInOutQuad(currentTime, start, change, duration);
        move(val);
        
        if (currentTime < duration) {
            requestAnimFrame(animateScroll);
        } else {
            callback?.();
        }
    };

    animateScroll();
};