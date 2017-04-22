# Game documentation
Here we have a traditional tic-tac-toe game to be played by two people in-browser. Players are given instructions to get them started following the traditional rules of the game:

1. Players alternate marking spaces on the board.
2. If a player fills a full row, full column, or major diagonal (top corner to opposite bottom corner) with their marker, they win!
3. If all spaces are filled without a winner, the game is over and must be reset.

## Project setup
### Playing the game
Simply load the game page in a browser. The game uses only client-side languages that browsers understand, so the browser will take care of everything.

### Developer setup
This app is built with the new ES6 version of Javascript and the Sass CSS pre-processor (SCSS-style). To generate the backwards-compatible Javascript and true CSS, we're using the [Grunt build tool](https://gruntjs.com/). You'll need the [npm](https://www.npmjs.org/), the Node.js package manager, installed on your local environment.

After downloading game files, run `npm install` in your terminal to install the `node_modules` directory and project dependencies. Once that is complete, **run the command `grunt`** and your terminal will start watching for Javascript or SCSS changes to update the game code.

You can also run `grunt scss` to run the CSS build once or `grunt scripts` to run the Javascript build once.

The game Javascript will be tested against [ESLint](eslint.org/) rules set by an included `.eslintrc` file. I also included the `.scss-lint.yml` file for [Sass linting](https://github.com/brigade/scss-lint). It's not included in the Grunt tasks, but developers are encouraged in their editors to use it for code consistency.

## Thought process
In building the game, two major goals of mine were to write the Javascript very legibly for other developers and to make it as flexible to changes in the game. To the first point, all game functions are broken out individually for reuse as needed. Each function has a limited purpose that I tried to make clear with its name and code documentation. At any point where I saw code replication or problematic legibility, I moved that code into a function or variable, such as with the very verbose `rowIdx/colInx` variables used to find array indexes for a following conditional statement.

Traditionally, tic-tac-toe games are played in three by three grids, hence the name of the game. Initially, to focus on the core mechanics, I wrote out the win scenarios in the `rowOrCol`, `diagWin1`, and `diagWin2` variables by hand. With only three rows and columns the win scenarios were limited so this wasn't too long. I knew right away that it would be better if I didn't use "magic numbers" hard-coded, even if the three by three grid is the standard.

I also thought that it would be great if the player could choose the size of the grid they wanted to play on. If they wanted an intense game, they could have five by five grids with 25 squares to fill. In mentioning this to a friend, she reminded me that more squares increased the likelihood of a "game over" scenario. I decided against exposing the option to change the grid, but I did refactor my JS to allow the possibility. All win scenarios are now generated based on a `gridLength` variable that could potentially be changed. At this moment, this variable is also set based on the HTML markup, so all someone would really need to do is expand the grid via HTML.

This project also game me opportunity to use some ES6 features that I hadn't previously. This included creating a Javascript class for the players, so functionality could easily be added to generate new players based on user inputs. I also used the `Object.assign()` function, which is a fantastically simple way to clone an object--in this case the row and column win scenario object. Since the Babel ES6 compiler only converts the new syntax, I loaded this new addition to the Object prototype with the great conditional polyfill service, [Polyfill.io](https://polyfill.io/v2/docs/). Since `Object.assign()` is the only new feature I needed, I limited my use of Pollyfill.io to that once feature, avoiding needless bloat.

On the HTML markup side of things, I kept it fairly simple. All content other than the game name is loaded via Javascript based on the game status. One choice I made was to use the `button` element for the board squares. This could have been built with the squares as `div`, `li`, or `a` elements, but I thought that `button` was most appropriate for semantic and accessibilty reasons. It comes "out of the box" ready for interaction and also can be easily disabled with the `disabled` attribute once the space is used.

Finally, in the CSS I decided to use the new CSS Grid spec for the game board. The spec is now supported in all major modern browsers and given that the board is literally a grid, it seemed an appropriate use. The `grid-template` property on the board would need to be changed if the HTML markup was expanded to increase the grid size.

## Enhancement ideas

- Track wins by each player across games in a single session, alternating the starting player.
- Save the game state by setting a cookie to associate with game status.
- Let the players *optionally* enter their names (for the win message) and choose alternate marker symbols. I would not want to require this or have it visible automatically since it might unnecessarily clutter the interface.
- Customize some SVG animations for win and game over messages.
