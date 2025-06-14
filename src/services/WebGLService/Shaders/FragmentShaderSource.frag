#version 300 es

precision highp float;

uniform vec4 u_color;
uniform sampler2D u_image;

varying vec2 v_texCoord;

out vec4 out_color;

void main() {
    out_color = u_color;
}
