// test for p5 animation as stimuli

let mic;

let aniTest = (p5) => {
    p5.setup = () => {
        // Create an Audio input
        mic = new p5.constructor.AudioIn();
        mic.start();
        p5.createCanvas(400, 400);
    }

    p5.draw = () => {
        p5.background(200);
        let vol = mic.getLevel()*800;
        p5.ellipse(200, 360-vol, 80, 80);
    //    if (p5.mouseIsPressed) {
    //        p5.fill(0);
    //    } else {
    //        p5.fill(255);
    //    }
    //    p5.ellipse(p5.mouseX, p5.mouseY, 80, 80);
    }
}

export default aniTest;