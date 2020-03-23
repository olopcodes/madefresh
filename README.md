# This is my dev starter kit
    -   The kit uses webpack 4 to bundle files and Postcss as a preprocessor
    -   run npm init, then npm install to get all the packages in the package.json file 

## Changes you may have to make on VSCode:
    1.  go to settings at the bottom of the code editor

    2.  check the top right of the settings page with a paper with an arrow icon and click on it

    3.  add a comma and add this to the json "files.associations": { "*.css": "scss" }

## Other notes:
    1.  keep naming your css files .css and should be able to do most of the things you do with sass with postcss

    2.  need to add postcss-sassy to use sass like mixins
            - npm install postcss-sassy-mixins

    3.  Else you can write mixins in postCss like this:

                @define-mixin atMedium {
                    // content
                }
        use a mixin like this: 
            @mixin atMedium { 
                // content 
                }
