const SCALE = 16;

function put_pixel(sketch, x, y, color, alpha) {
    let c = sketch.color(color);
    c.setAlpha(alpha);
    sketch.push();
    sketch.stroke(c);
    sketch.fill(c);
    x = Math.floor(x);
    y = Math.floor(y);
    sketch.rect(x * SCALE, y * SCALE, SCALE, SCALE);
    sketch.pop();
}

function cross(sketch, x, y) {
    sketch.push();
    const l = 50;
    x += .5;
    y += .5;
    sketch.stroke(255, 0, 0);
    sketch.strokeWeight(1);
    sketch.line(x * SCALE - l, y * SCALE, x * SCALE + l, y * SCALE);
    sketch.line(x * SCALE, y * SCALE - l, x * SCALE, y * SCALE + l);
    sketch.pop();
}

function put_pair(sketch, flip, x, y, alpha) {
    let z = Math.round(255 * (y - Math.floor(y)));
    if (flip) {
        put_pixel(sketch, y, x, 255, Math.round((255 - z) * alpha));
        put_pixel(sketch, y + 1, x, 255, Math.round(z * alpha));
    } else {
        put_pixel(sketch, x, y, 255, Math.round((255 - z) * alpha));
        put_pixel(sketch, x, y + 1, 255, Math.round(z * alpha));
    }
}

function line(sketch, X0, Y0, X1, Y1) {
    let flip;
    const p = 2;

    flip = Math.abs(Y1 - Y0) > Math.abs(X1 - X0);
    if (flip)
        [X0, Y0, X1, Y1] = [Y0, X0, Y1, X1];
    if (X0 > X1)
        [X0, Y0, X1, Y1] = [X1, Y1, X0, Y0];

    let slope = (Y1 - Y0) / (X1 - X0);
    let x = Math.floor(X0);
    let y = Y0 - (X0 - x) * slope;

    put_pair(sketch, flip, x, y, Math.pow(1 - X0 + x, p));
    x++;
    y += slope;
    while (x < X1) {
        put_pair(sketch, flip, x, y, 1);
        x += 1;
        y += slope;
    }
    put_pair(sketch, flip, x, y, Math.pow(1 - x + X1, p));
    if (flip)
        [X0, Y0, X1, Y1] = [Y0, X0, Y1, X1];
    cross(sketch, X0, Y0);
    cross(sketch, X1, Y1);
}

new p5(function (sketch) {
    sketch.setup = () => {
        sketch.createCanvas(800, 800);
        sketch.stroke(255);
        sketch.strokeWeight(0);
        sketch.fill(255);
    };
    sketch.draw = () => {
        let mx = sketch.mouseX / SCALE - .5;
        let my = sketch.mouseY / SCALE - .5;
        sketch.background(0);
        let t = sketch.millis();
        put_pixel(sketch, 1, 1, 255);
        put_pixel(sketch, 2, 2, 255);
        // line(sketch, 30, 5, 23, 22);
        // line(sketch, 30, 5, mx, my);
        let midx = 20 + Math.cos(t / 2300);
        let midy = 13 + Math.sin(t / 2300);
        line(sketch, 10 + Math.cos(t / 1000), 10 + Math.sin(t / 1300), midx, midy);
        line(sketch, midx, midy, 40 + Math.cos(-t / 1500), 15 + Math.sin(-t / 1900));
        line(sketch, midx, midy, 50, 0);
        line(sketch, midx, midy, 0, 50);
    };
}, document.getElementById("sketch"));
