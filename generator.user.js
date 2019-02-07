// ==UserScript==
// @name         Blockify Scratch 3.0
// @namespace    http://tampermonkey.net/
// @version      0.3e
// @description  try to take over the world!
// @author       NitroCipher
// @match        https://scratch.mit.edu/blockify*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdn.rawgit.com/beautify-web/js-beautify/v1.8.9/js/lib/beautify.js
// ==/UserScript==

(function() {
    'use strict';
    //https://scratch.mit.edu/blockify/?id=279911751 for general testing
    //https://scratch.mit.edu/blockify/?id=284721167 for all the normal blocks
    var id = getUrlVars()["id"];
    var fullUrl = "https://projects.scratch.mit.edu/" + id;
    var blockMapUrl = "https://raw.githubusercontent.com/s3blocks/s3bGenerator/master/blockdata.js"
    var derpyList = "";
    var blockMap;
    var blockData;
    $.ajax({
        url: blockMapUrl,
        json: "text"
    }).done( function (data) {
        eval("blockMap =" + data + ";");
    });
    $.ajax({
        url: fullUrl,
        json: "json"
    }).done( function (data) {
        var project = JSON.parse(data);
        //document.write(JSON.stringify(project.targets[1].blocks));
        if (getUrlVars()["json"] !== "true") {
            let simpleProject = {
                sources: project.targets.map((stuff, index) => {
                    return {
                        name: stuff["name"],
                        blocks: getAllBlocks(stuff["blocks"]),
                    }
                })
            }
        }
        $(".box-content").css("text-align", "left");
        $(".box-content").css("padding-left", "50px");
        //$(".box-content").html("<pre>" + js_beautify(JSON.stringify(simpleProject)) + "</pre>");
        $(".box-content").html("<pre>" + js_beautify(JSON.stringify(project)) + "<pre>");
        //$(".box-content").html("<pre>" + derpyList + "</pre>");
        //$(".box-content").html("<pre>" + js_beautify("{" + derpyList + "}") + "</pre>");
        if (getUrlVars()["json"] !== "true") {
            $(".box-content").html("<pre>" + derpyList + "</pre>");
            window.open("https://s3blocks.github.io/#" + encodeURI(derpyList))
        }
    });

    function getAllBlocks(blocks) {
        document.pro = blocks;
        blockData = [];
        for(var blockID in blocks) {
            blockData.push({
                opcode: blocks[blockID].opcode,
                parent: blocks[blockID].parent,
                child: blocks[blockID].child
            });
            //console.log(blockID);
            var block = getBlock(blocks[blockID], blocks);

            if (blocks[blockID].parent === null) {
                derpyList += "\n" + block + "\n";
                getNextOf(blocks[blockID], blocks, 0);
                //console.log(getNextOf(blocks[blockID], blocks, 1));
            }
        };
        return blockData;
    }

    function getNextOf(block, allBlocks, output, string) {
        //console.log(JSON.stringify(block));
        //console.log(allBlocks[block.next]);
        if (block.next !== null) {
            var blockChild = getBlock(allBlocks[block.next], allBlocks);
            if (output == 1) {
                return blockChild;
            } else if (output == 2){
                //console.log(substack);
                //console.log(block);
                var newString = string += "\n" + blockChild
                //console.log(newString)
                return (getNextOf(allBlocks[block.next], allBlocks, output, newString));
            } else {
                //console.log(derpyList);
                derpyList += blockChild + "\n";
                getNextOf(allBlocks[block.next], allBlocks, output, string);
            }
        } else if (output == 2){
            return string;
        }
    }

    function getBlock(block, allBlocks) {
        var thing = block.opcode;
        //alert(thing);
        if (blockMap.hasOwnProperty(thing)) {
            var blockCode = blockMap[thing].blockcode
            blockCode = blockCode.split(" ");
            var input = 0;
            var field = 0;
            //alert(Object.keys(block.inputs).length + ": " + block.opcode + ": " + blockCode); //debug
            blockCode.forEach(function(item, index) {
                var substack = "";
                //alert((Object.keys(block.inputs).length > input) + ": " + block.opcode + ": " + blockCode);
                switch (item) {
                    default:
                        blockCode[index] = blockCode[index];
                        break;
                    case "%n":
                        if (Object.keys(block.inputs).length > input) {
                            blockCode[index] = "(" +block.inputs[ Object.keys(block.inputs)[input] ][1][1]+ ")";
                        } else {
                            blockCode[index] = "()";
                        }
                        input++;
                        break;
                    case "%c":
                        if (Object.keys(block.inputs).length > input) {
                        blockCode[index] = "[" +block.inputs[ Object.keys(block.inputs)[input] ][1][1]+ "]";
                        } else {
                            blockCode[index] = "[#FF00FF]"
                        }
                        input++;
                        break;
                    case "%s":
                        if (Object.keys(block.inputs).length > input) {
                            blockCode[index] = "[" +block.inputs[ Object.keys(block.inputs)[input] ][1][1]+ "]";
                        } else {
                            blockCode[index] = "[]";
                        }
                        input++;
                        break;
                    case "%r":
                        if (Object.keys(block.inputs).length > input) {
                            blockCode[index] = "(" +block.inputs[ Object.keys(block.inputs)[input] ][0]+ " v)";
                        } else {
                            blockCode[index] = "( v)";
                        }
                        input++;
                        break;
                    case "%m":
                        if (Object.keys(block.fields).length >= field) {
                            blockCode[index] = "[" +block.fields[ Object.keys(block.fields)[field] ][0]+ " v]";
                        } else {
                            blockCode[index] = "[ v]";
                        }
                        field++;
                        break;
                    case "%b":
                        if (Object.keys(block.inputs).length > input) {
                            blockCode[index] = "<>";
                        } else {
                            blockCode[index] = "<>";
                        }
                        input++
                        break;
                    case "{}":
                        if (Object.keys(block.inputs).length > input) {
                            var subTop = block.inputs[ Object.keys(block.inputs)[input] ];
                            if (subTop[1] !== null) {
                                var firstBlock = "\n" + getBlock(allBlocks[subTop[1]], allBlocks);
                                substack += (getNextOf(allBlocks[subTop[1]], allBlocks, 2, firstBlock));
                                if (block.opcode == "control_if_else" && input == 1) {
                                    blockCode[index] = substack + "\n";
                                } else {
                                    blockCode[index] = substack + "\nend";
                                }
                            } else {
                                if (block.opcode == "control_if_else" && input == 1) {
                                    blockCode[index] = "\n" + substack + "\n";
                                } else {
                                    blockCode[index] = substack + "\nend";
                                }
                            }
                        } else {
                            if (block.opcode == "control_if_else" && input == 1) {
                                blockCode[index] = "\n" + substack + "\n";
                            } else {
                                blockCode[index] = substack + "\nend";
                            }
                        }
                        input++
                        break;
                }

            });
            //derpyList += blockCode.join(" ") + "\n";
            //console.log(blockCode.join(" "));
            return blockCode.join(" ");
        } else {
            return block.opcode;
        }
    }

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }
    // Your code here...
})();
