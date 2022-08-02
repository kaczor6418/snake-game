# snake-game

> Still in development

1. [Philosophy](#philosophy)
2. [Requirements](#requirements)
3. [Downloading the repository](#downloading-the-repository)
4. [Scripts](#scripts)
5. [Architecture](#architecture)

## Philosophy

I wanted to check how JavaScript performs in hard ML/AI computations and is there a sense to create ML/AI projects in
JS (including learning process). I also wanted to create an application that will allow to easily create comparison
between different RL algorithms, environments(games), off-policy and on-policy

## Requirements

Before you will use this repository make sure that you have installed:

- **_Git_**

  - If you are a **Windows** or **macOS** user visit this link **[Downloading Git](https://git-scm.com/download/win)**
    then download appropriate installer and install it.
  - If you are a **Linux** (Arch-based distribution) user you can paste bellow scrip into your terminal or visit this
    page **[Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)**

    ```bash
    pacman -S git
    ```

- **_Node.js_** and **_npm_**

  - If you are a **Windows** or **macOS** user visit this link **[Node.js download](https://nodejs.org/en/download/)**
    then download _LTS_ version for Windows and install it.
  - If you are a **Linux** (Arch-based distribution) user you can paste bellow scrip into your terminal or visit this
    page **[Node installation instruction](https://aur.archlinux.org/packages/nvm)**
    or use **[nvm](https://github.com/nvm-sh/nvm#install--update-script)**

    ```bash
    paru -S nvm
    nvm install node
    nvm use node
    ```

If you followed every step, you should be ready to start using this repository. To make sure that you have installed
everything correctly open your terminal git-bash and run the following commands:

- To check **git**: _`git --version`_ → you should see output with **git** version
- To check **node.js**: _`node --version`_ → you should see output with **node.js** version
- To check **npm**: _`npm --version`_ → you should see output with **npm** version
  serving**

## Downloading the repository

- Open your terminal / git-bash in location where you create a directory which will contain this repository

- Run the following command in your terminal / git-bash

  ```bash
  git clone https://github.com/kaczor6418/snake-game.git
  cd ./snake-game
  ```

## Scripts

- `npm run serve` → starts webpack dev server over https under 8080 port
- `npm run build` → creates project production build
- `npm run test` → run all tests in project. To run single test suite simple pass file name (`npm run test app.spec.ts`)
- `npm run test:watch` → run tests in watch mode. If you change any test case tests will be re-triggered
- `npm run lint:ts` → run eslint (static code analysis tool) for all _`.ts`_ connected with _src/index.ts_ and print all
  issues
- `npm run lint:scss` → run stylelint (static code analysis tool) for all _`.scss`_
- `npm run lint:fix` → run eslint and stylelint for all `.ts` and `.scss` files and fix all fixable issues

## Architecture

> High level of app architecture overview

<center>
	<p>
		<img src="https://raw.githubusercontent.com/kaczor6418/snake-game/master/docs/snake-game-architecture.jpg" alt="snake-game architecture">
	</p>
</center>
