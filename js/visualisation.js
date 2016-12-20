window.getVis = function () {
    var margin = {
            top: 10
            , right: 10
            , bottom: 10
            , left: 10
        }
        , width = 1000 - margin.left - margin.right
        , height = 600 - margin.top - margin.bottom;
    var formatNumber = d3.format(",.0f")
        , format = function (d) {
            return d + " nodes";
        }
        , color = d3.scale.category20();
    var svg = d3.select("#chart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var sankey = d3.sankey().nodeWidth(90).nodePadding(15).size([width, height]);
    var path = sankey.link();
    //loading the data though a json file
    if (typeof window.chosen_major != 'undefined') {
        d3.json("json/visuals/" + window.chosen_major + ".json", function (error, graph) {
            console.log(graph)
            sankey.nodes(graph.nodes).links(graph.links).layout(32);
            var link = svg.append("g").selectAll(".link").data(graph.links).enter().append("path").attr("class", "link").style("fill", "none").style("stroke", function (d) {
                return d.target.color = color(d.target.name.replace(/ .*/, ""));
            }).attr("d", path).style("stroke-width", function (d) {
                return Math.max(1, d.dy);
            }).sort(function (a, b) {
                return b.dy - a.dy;
            });
            link.append("title").text(function (d) {
                return d.source.name + " → " + d.target.name + "\n" + format(d.value);
            });
            var node = svg.append("g").selectAll(".node").data(graph.nodes).enter().append("g").attr("class", "node").attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                //dragging feature disabled for now
                /*.call(d3.behavior.drag()
                .origin(function(d) { return d; })
                .on("dragstart", function() { this.parentNode.appendChild(this); })
                .on("drag", dragmove))*/
            ;
            node.append("rect").attr("height", function (d) {
                return d.dy;
            }).attr("width", sankey.nodeWidth()).style("fill", function (d) {
                return d.color = color(d.name.replace(/ .*/, ""));
            }).style("stroke", function (d) {
                return d3.rgb(d.color).darker(2);
            }).append("title").text(function (d) {
                return d.name + "\n" + format(d.value);
            });
            node.append("text").attr("x", 40).attr("y", function (d) {
                return d.dy / 2;
            }).attr("dy", ".35em").attr("text-anchor", "start").attr("transform", null).text(function (d) {
                return d.name;
            }).call(wrap, 0).filter(function (d) {
                return d.x < width / 2;
            }).attr("x", 40 + sankey.nodeWidth()).attr("text-anchor", "start");

            function dragmove(d) {
                d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
                sankey.relayout();
                link.attr("d", path);
            }

            function wrap(text, width) {
                text.each(function () {
                    var text = d3.select(this)
                        , words = text.text().split(/\s+/).reverse()
                        , word, line = []
                        , lineNumber = 0
                        , lineHeight = 1, // ems
                        y = text.attr("y") - ((words.length + 1) * 4)
                        , dy = parseFloat(text.attr("dy"))
                        , tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                    while (word = words.pop()) {
                        line.push(word);
                        tspan.text(line.join(" "));
                        if (tspan.node().getComputedTextLength() > width) {
                            line.pop();
                            tspan.text(line.join(" "));
                            line = [word];
                            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                        }
                    }
                });
            }
        });
    }
    //loading data through a modified javascript object
    //Not working, needs to be fixed. dataObject being passed is not the required format. 
//    else {
//        var graph = window.dataObject;//getData(); //
//        console.log(graph)
//            //        presentVisual();
//        sankey.nodes(graph.nodes).links(graph.links).layout(32);
//        var link = svg.append("g").selectAll(".link").data(graph.links).enter().append("path").attr("class", "link").style("fill", "none").style("stroke", function (d) {
//            return d.target.color = color(d.target.name.replace(/ .*/, ""));
//        }).attr("d", path).style("stroke-width", function (d) {
//            return Math.max(1, d.dy);
//        }).sort(function (a, b) {
//            return b.dy - a.dy;
//        });
//        link.append("title").text(function (d) {
//            return d.source.name + " → " + d.target.name + "\n" + format(d.value);
//        });
//        var node = svg.append("g").selectAll(".node").data(graph.nodes).enter().append("g").attr("class", "node").attr("transform", function (d) {
//                return "translate(" + d.x + "," + d.y + ")";
//            })
//            //dragging feature disabled for now
//            /*.call(d3.behavior.drag()
//            .origin(function(d) { return d; })
//            .on("dragstart", function() { this.parentNode.appendChild(this); })
//            .on("drag", dragmove))*/
//        ;
//        node.append("rect").attr("height", function (d) {
//            return d.dy;
//        }).attr("width", sankey.nodeWidth()).style("fill", function (d) {
//            return d.color = color(d.name.replace(/ .*/, ""));
//        }).style("stroke", function (d) {
//            return d3.rgb(d.color).darker(2);
//        }).append("title").text(function (d) {
//            return d.name + "\n" + format(d.value);
//        });
//        node.append("text").attr("x", 40).attr("y", function (d) {
//            return d.dy / 2;
//        }).attr("dy", ".35em").attr("text-anchor", "start").attr("transform", null).text(function (d) {
//            return d.name;
//        }).call(wrap, 0).filter(function (d) {
//            return d.x < width / 2;
//        }).attr("x", 40 + sankey.nodeWidth()).attr("text-anchor", "start");
//
//        function dragmove(d) {
//            d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
//            sankey.relayout();
//            link.attr("d", path);
//        }
//
//        function wrap(text, width) {
//            text.each(function () {
//                var text = d3.select(this)
//                    , words = text.text().split(/\s+/).reverse()
//                    , word, line = []
//                    , lineNumber = 0
//                    , lineHeight = 1, // ems
//                    y = text.attr("y") - ((words.length + 1) * 4)
//                    , dy = parseFloat(text.attr("dy"))
//                    , tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
//                while (word = words.pop()) {
//                    line.push(word);
//                    tspan.text(line.join(" "));
//                    if (tspan.node().getComputedTextLength() > width) {
//                        line.pop();
//                        tspan.text(line.join(" "));
//                        line = [word];
//                        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
//                    }
//                }
//            });
//        }
//
//        function getData() {
//            return window.dataObject
//        }
    }