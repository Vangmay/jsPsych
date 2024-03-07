// test for p5 animation as stimuli

import { GPoint } from "../grafica";

let mic;

//plot the scatter of random distribution
//not worked because Gpoint in the browser is not a constructor...
function plotScatter(p5) {
    let points = [];
    let seed = 100 * p5.random();

    for (var i = 0; i < 100; i++) {
        points[i] = new GPoint(i, 10 * p5.noise(0.1 * i + seed));
    }
    // Create a new plot and set its position on the screen
    var plot = new GPlot(p5);
    plot.setPos(25, 25);

    // Set the plot title and the axis labels
    plot.setPoints(points);
    plot.getXAxis().setAxisLabelText("x axis");
    plot.getYAxis().setAxisLabelText("y axis");
    plot.setTitleText("A very simple example");

    // Draw it!
    plot.defaultDraw();
}

let aniTest = (p5) => {
    p5.setup = () => {
        // Create an Audio input
        mic = new p5.constructor.AudioIn();
        mic.start();
        p5.createCanvas(400, 400);
        //plotScatter(p5);
    }

    p5.draw = () => {
        p5.background(200);
        let vol = mic.getLevel()*800;
        p5.ellipse(200, 360-vol, 80, 80);
            if (p5.mouseIsPressed) {
                p5.fill(0);
            } else {
                p5.fill(255);
            }
            p5.ellipse(p5.mouseX, p5.mouseY, 80, 80);

    }
}

export default aniTest;