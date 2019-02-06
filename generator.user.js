// ==UserScript==
// @name         Blockify Scratch 3.0
// @namespace    http://tampermonkey.net/
// @version      0.1
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
    var derpyList = "";
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
                    blocks: getBlocks(stuff["blocks"])
                }
            })
        }
        $(".box-content").css("text-align", "left");
        $(".box-content").css("padding-left", "50px");
        $(".box-content").html("<pre>" + js_beautify(JSON.stringify(simpleProject)) + "</pre>");
        $(".box-content").html("<pre>" + js_beautify("{" + derpyList + "}") + "</pre>");
        //$(".box-content").html("<pre>{<br>" + derpyList + "}</pre>");
    });

    function getBlocks(blocks) {
        document.pro = blocks;
        var blockData = [];
        for(var item in blocks) {
            blockData.push({
                opcode: blocks[item].opcode
            });
            derpyList += blocks[item].opcode + ": {blockcode: 'value'},";
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
