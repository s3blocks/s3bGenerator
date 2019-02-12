# s3bGenerator
Generating block code from sb3 projects

This project is still early in development, and will be eventually turned into a solid webpage, rather than a Userscript feasting off Scratch.

## Usage

For testing purposes or development:
1. Install script using Tampermonkey
2. Go to ```https://scratch.mit.edu/blockify/?id=284721167``` (or use another project id)
3. It should convert the available block data to s3blocks, and open it on the site
4. You can also add ```&json=true``` to just get the original json for the project

If you want to play around with it in your browser:
1. Go to ```https://s3blocks.github.io/generator/?id=279911751``` (or use another project id)
2. It should convert the available block data to s3blocks, and display it right on the page!

## Notes/To-do

* Add implementation for custom blocks
* Add all extension blocks
* Add interface for sprite/script selection
* Add option to use #{project-id} over ?id={project-id}
* Add menu to paste project link
