// ==UserScript==
// @name         Blockify Scratch 3.0
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       NitroCipher
// @match        https://scratch.mit.edu/blockify*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdn.rawgit.com/beautify-web/js-beautify/v1.8.9/js/lib/beautify.js
// ==/UserScript==

(function() {
    'use strict';
    //https://projects.scratch.mit.edu/279911751 for general testing
    //https://projects.scratch.mit.edu/284721167 for all the normal blocks
    var id = getUrlVars()["id"];
    var fullUrl = "https://projects.scratch.mit.edu/" + id;
    var blockMapUrl = "https://raw.githubusercontent.com/s3blocks/s3bGenerator/master/blockdata.js"
    var derpyList = "";
    var blockMap;
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
        let simpleProject = {
            sources: project.targets.map((stuff, index) => {
                return {
                    name: stuff["name"],
                    blocks: getBlocks(stuff["blocks"]),
                }
            })
        }
        $(".box-content").css("text-align", "left");
        $(".box-content").css("padding-left", "50px");
        //$(".box-content").html("<pre>" + js_beautify(JSON.stringify(simpleProject)) + "</pre>");
        $(".box-content").html("<pre>" + js_beautify(JSON.stringify(project)) + "<pre>");
        //$(".box-content").html("<pre>" + derpyList + "</pre>");
        //$(".box-content").html("<pre>" + js_beautify("{" + derpyList + "}") + "</pre>");
        $(".box-content").html("<pre>" + derpyList + "</pre>");
        window.open("https://s3blocks.github.io/#" + encodeURI(derpyList))
    });

    function getBlocks(blocks) {
        document.pro = blocks;
        var blockData = [];
        for(var blockNum in blocks) {
            blockData.push({
                opcode: blocks[blockNum].opcode,
                parent: blocks[blockNum].parent
            });

            var thing = blocks[blockNum].opcode;
            //alert(thing);
            if (blockMap.hasOwnProperty(thing)) {
                var blockCode = blockMap[thing].blockcode
                blockCode = blockCode.split(" ");
                var input = 0;
                var field = 0;
                blockCode.forEach(function(item, index) {
                    switch (item) {
                        default:
                            blockCode[index] = blockCode[index];
                            break;
                        case "%n":
                            blockCode[index] = "(" +blocks[blockNum].inputs[ Object.keys(blocks[blockNum].inputs)[input] ][1][1]+ ")";
                            input++;
                            break;
                        case "%c":
                            blockCode[index] = "[" +blocks[blockNum].inputs[ Object.keys(blocks[blockNum].inputs)[input] ][1][1]+ "]";
                            input++;
                            break;
                        case "%s":
                            blockCode[index] = "[" +blocks[blockNum].inputs[ Object.keys(blocks[blockNum].inputs)[input] ][1][1]+ "]";
                            input++;
                            break;
                        case "%r":
                            blockCode[index] = "(" +blocks[blockNum].inputs[ Object.keys(blocks[blockNum].inputs)[input] ][0]+ " v)";
                            input++;
                            break;
                        case "%m":
                            blockCode[index] = "[" +blocks[blockNum].fields[ Object.keys(blocks[blockNum].fields)[field] ][0]+ " v]";
                            field++;
                            break;
                        case "%b":
                            blockCode[index] = "<>";
                            break;
                        case "{}":
                            blockCode[index] = "\nend";
                            break;
                    }

                });
                derpyList += blockCode.join(" ") + "\n";
            }
        };
        return blockData;
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
