#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

//color from vertex shader
in vec4 color;

// color of vertex node
uniform vec4 u_color;


// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
    // Just set the output to a constant reddish-purple
    outColor = color == vec4(0, 0, 0, 1) ? u_color : color;
}
