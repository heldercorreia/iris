# Iris

A simple demo of a palette rotation plasma effect implemented using HTML5 Canvas
and JavaScript. This project showcases smooth, vibrant color transitions and a
mesmerizing visual effect.

## History

This demo was first written in 2012, during the early stages of [HTML5 Canvas](https://html.spec.whatwg.org/multipage/canvas.html#the-canvas-element).
See this old [blog post](https://helderfoo.blogspot.com/2012/12/iris-more-html5-canvas-pixel.html)
I wrote then for context.

## Demo

Check out the [live demo](https://heldercorreia.bitbucket.io/html5/canvas/iris/index.html).

![Iris Screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEyj6MRnARxlAgaK6cioz80dV4CuP6YflTU8hHftPVAYMouj6kQ5pYrVoqCF6SNmo9aaSilGzI562AKSEOak06iZuGkeFXWwUuxF5_Zuy0aeNmyHTbvFNEw6yChrSqxbD_lV8ahbsEf2R9/s320/iris.png)


## Customization

The plasma effect demo comes with several pre-defined presets and customization
options, allowing you to tweak and experiment with the visuals easily. Here's
how you can customize the effect:

### Pattern Presets

The effect includes 10 pre-defined presets, each with unique parameters that
control the visual appearance of the plasma. You can switch between these
presets using the following keyboard keys:

- `0` to `9`: Select a specific preset (e.g., press `0` for the first preset,
`1` for the second, etc.).

### Dynamic Adjustments

Use these keyboard controls to modify the effect in real time:

#### Plasma Parameters
- **Amplitude / Frequency**: `W` `X` `A` `D`

#### Resize Modes
- `N`: Shrink the canvas size.
- `M`: Grow the canvas size.
- `F`: Resize to fit the full viewport.

### Animation Control
- `H`: Toggle animation on or off.

### Angle Functions
Change the mathematical function used for the plasma's angle calculations:
- `S`: Use `Math.sin`.
- `T`: Use `Math.tan`.
- `U`: Use `Math.atan`.

### Base Color Channel
Switch the primary color channel used in the effect:
- `R`: Red channel.
- `G`: Green channel.
- `B`: Blue channel.

### Randomization
Every 3 seconds, the effect will automatically randomize the color channel and
pattern preset, keeping the visuals fresh and dynamic. You can manually trigger
these randomizations via the JavaScript function `randomizeEffects()`.


Experiment with these options to create unique and mesmerizing plasma effects!


## FPS Display

The current frames-per-second (FPS) is displayed in the top-left corner of the
viewport. This helps you monitor the performance of the plasma effect in real
time as you experiment with different presets and customizations.


## License

This project is open-source and available under the [MIT License](LICENSE).
