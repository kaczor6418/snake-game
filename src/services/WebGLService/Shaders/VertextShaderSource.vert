#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec3 a_position;
in vec4 a_color;

// Used to pass in the resolution of the canvas
uniform vec2 u_resolution;
out vec4 color;
// all shaders have a main function
void main() {

    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position.xy / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;
    color = a_color;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
