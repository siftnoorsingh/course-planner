        $(document).ready(function () {
            var appData = {};
            var jsonData = {};
            var checkedValues = {};
            var checkedValues_subs = {};
            var major_arr = [];
            var second_year_arr = [];
            var isSuperset = false;
            var first_year_arr = [];
            var third_year_arr = [];
            var target_sub_value_first = [];
            var target_sub_value_second = [];
            var target_sub_second = [];
            var target_sub_value_third = [];
            var target_sub_value_third_final = [];
            // when the user clicks the "Get Careers"  button
            $("#careers").on('click', function (e) {
                // clear the section with id "careers_list"
                $('#careers_list ul').empty();
                $('#careers_list pre').empty();
                e.preventDefault();
                $.getJSON('json/careers.json', function (data) {
                    $.each(data.careers, function (i, data2) {
                        // append all the careers from the json file into a list
                        $('#careers_list ul').append('<li><a href="#" class="select_career" id="' + data2.career + '"> ' + data2.career + '</a></li>');
                    });
                    bindSelectionHandler();
                });
                $('#fetch').hide();
                $('#careers_list').show();
            });
            // when the user clicks the "Get Majors"  button
            $("#majors").on('click', function (e) {
                // clear the section with id "majors_list"
                $('#majors_list ul').empty();
                $('#majors_list pre').empty();
                e.preventDefault();
                $.getJSON('json/majors.json', function (data) {
                    $.each(data.majors, function (i, data2) {
                        // append all the majors from the json file into a list
                        $('#majors_list ul').append('<li><a href="#" class="select_major2" id="' + data2.major + '"> ' + data2.major + '</a></li>');
                    });
                    bindSelectionHandler();
                });
                $('#fetch').hide();
                $('#majors_list').show();
            });
            // when the user clicks the "Get Subjects(First Year)"  button
            $("#subjects").on('click', function (e) {
                // clear the section with id "subjects_list"
                $('#subjects_list ul').empty();
                $('#subjects_list pre').empty();
                e.preventDefault();
                $.getJSON('json/firstyrsubs.json', function (data) {
                    $.each(data.first_year_subs, function (i, data2) {
                        $.each(this, function (key, value) {
                            // append all the first year subjects from the json file into a list of checkboxes
                            $('#subjects_list ul').append('<li><label><input type="checkbox" class="select_sub" id="' + key + '"> ' + key + '</label></li>');
                        });
                    });
                    subsChecked();
                });
                $('#fetch').hide();
                $('#subjects_list').show();
            });
            var bindSelectionHandler = function () {
                // when the user clicks on one of the careers
                $("#careers_list a.select_career").on('click', function (e) {
                    $('#careers_list ul').empty();
                    // get the id of the selected career
                    chosen_career = $(this).attr('id')
                    e.preventDefault();
                    $.getJSON('json/careers.json', function (data) {
                        // save the data to a local variable
                        appData.careers = data.careers
                        buildCareersList();
                    });
                });
                // when the user clicks on one of the majors
                $("#majors_list a.select_major2").on('click', function (e) {
                    $('#majors_list ul').empty();
                    // get the id of the selected major
                    chosen_major2 = $(this).attr('id')
                    e.preventDefault();
                    $.getJSON('json/majors.json', function (data) {
                        // save the data to a local variable
                        appData.majors = data.majors
                        buildSubsList();
                    });
                });
            }
            var buildCareersList = function () {
                $.each(appData.careers, function (i, data2) {
                    // if the chosen career matches a career from the json file, get the corresponing majors for that career from the json file.
                    if (data2.career == chosen_career) {
                        $('#choose_careers pre').html('<h2>Chosen Career: ' + data2.career + ' </h2>');
                        // add the resulting majors into a list
                        $('#choose_careers ul').append('<li><a href="#" class="select_major" id="' + data2.major + '"> ' + data2.major + '</a></li>');
                    }
                });
                $('#choose_careers').show();
                buildMajorVis();
            }
            var buildSubsList = function () {
                $('#choose_majors pre').empty();
                $('#choose_majors ul').empty();
                $.each(appData.majors, function (i, data2) {
                    // if the chosen major matches a major from the json file, get the corresponing third year subjects for that major from the json file.
                    if (data2.major == chosen_major2) {
                        $('#choose_majors pre').html('<h2>Chosen Major: ' + data2.major + ' </h2>');
                        $.each(data2.third, function (i, data3) {
                            $.each(this, function (key, value) {
                                $('#choose_majors ul').append('<li><label><input type="checkbox" class="select_major" id="' + value + '"> ' + value + '</label></li>');
                            });
                        });
                    }
                });
                $('#choose_majors').show();
                subsChecked();
            }
            var subsChecked = function () {
                    // when the user checks or unchecks a checkbox in the section with id "choose_majors"
                    $("#choose_majors li").on('click', 'input[type="checkbox"]', function (e) {
                        $("#show_subjects ul").empty();
                        // retrieve  the ids of all the checked third year subjects and pass them to an array
                        checkedValues = $("#choose_majors li input[type=checkbox]:checked").map(function () {
                            return $(this).attr('id');
                        });
                        $.each(checkedValues, function (i, d) {
                            $("#show_subjects ul").append('<li>' + d + '</li>');
                        });
                        // dummy button and JSON file passed as is without modification as requrested by the Faculty of Science team for demo purposes.
                        // this function needs to be improved further to get the corresponding first year subjects for the selected third year subjects
                        // once the first year subjects are selected, the visualisation needs to be presented for the corresponding selected first and third
                        // year subjects by exctracting the selected nodes and links from the json file for that major.
                        $("#show_subjects").html('<button href="#" id="view_majors_from_subs">View majors</button>');
                        $("#show_subjects").show();
                        buildMajorVis();
                    });
                    // when the user checks or unchecks a checkbox in the section with id "subjects_list" 
                    $("#subjects_list li").on('click', 'input[type="checkbox"]', function (e) {
                        $("#show_majors ul").empty();
                        // retrieve  the ids of all the checked first year subjects and pass them to an array
                        checkedValues = $("#subjects_list li input[type=checkbox]:checked").map(function () {
                            return $(this).attr('id');
                        }).get();
                        $.each(checkedValues, function (i, d) {
                            $("#show_majors ul").append('<li>' + d + '</li>');
                        });
                        $("#show_majors").html('<button href="#" id="view_majors">View majors</button>');
                        $("#show_majors").show();
                        buildMajorsList();
                    });
                    // when the user checks or unchecks a checkbox in the section with id "filtered_third_subs" 
                    $("#filtered_third_subs li").on('click', 'input[type="checkbox"]', function (e) {
                        $("#show_chosen_subjects ul").empty();
                        // add the selected(checked) third year subjects to an array "checkedValuesSubs" 
                        checkedValuesSubs = $("#filtered_third_subs li input[type=checkbox]:checked").map(function () {
                            return $(this).attr('id');
                        }).get();
                        // if the subject in the array is present in the json file for the major, get the index of that subject 
                        // and add it to an array "target_sub_value_third_final"
                        target_sub_value_third_final = []
                        $.each(checkedValuesSubs, function (i, sub) {
                            $("#show_chosen_subjects ul").append('<li>' + sub + '</li>');
                            $.each(jsonData.nodes, function (i, data2) {
                                if (data2.name==sub){
                                    // keep only distinct values in the array and remove duplicates
                                    target_sub_value_third_final = arrayUnique(target_sub_value_third_final.concat(i));
                                }
                            });                    
                        });
                        $("#show_chosen_subjects").append('<button href="#" id="view_visual">View Visual</button>');
                        $("#show_chosen_subjects").show();
                        buildMajorData();
                    });
                }

            //remove all duplicate values in an array
            function arrayUnique(array) {
                var a = array.concat();
                for (var i = 0; i < a.length; ++i) {
                    for (var j = i + 1; j < a.length; ++j) {
                        if (a[i] === a[j]) a.splice(j--, 1);
                    }
                }
                return a;
            }
            var buildMajorsList = function () {

                $("#view_majors").on('click', function () {
                    $("#show_majors").hide();
                    $.getJSON('json/firstyrsubs.json', function (data) {
                        $.each(data.subjects, function (i, data2) {
                            var chosen_subs = data2.first_subs
                            // check if chosen_subs is contained in arr2(checkedValues)
                            //ie the array of values selected in the checkboxes is a superset of the first year variations in the JSON file
                            isSuperset = chosen_subs.every(function (val) {
                                return checkedValues.indexOf(val) >= 0;
                            });
                            // if the checked subjects are a superset of a given variation from the json file, append the corresponding majors for that
                            // variation to "major_arr"
                            if (isSuperset) {
                                major_arr = arrayUnique(major_arr.concat(data2.major)).sort();
                            }
                        });
                        filteredMajors();
                    });
                });
            }
            var filteredMajors = function () {
                $('#subjects_list pre').empty();
                $('#subjects_list ul').empty();
                $('#subjects_list').hide();
                //        $("#filtered_majors").empty();
                $("#filtered_majors  pre").html("Majors having the selected first year subjects")
                // create a list for the filtered majors retrieved using the buildMajorsList() function
                $.each(major_arr, function (key, value) {
                    $("#filtered_majors ul").append('<li><a href="#" class="chosen_major" id="' + value + '"> ' + value + '</a></li>');
                });
                $("#filtered_majors").show();
                chosenMajor();
            }
            //add comments for this function
            var chosenMajor = function () {
                // when a major is chosen from a list of majors, presented after selecting a set of first year subjects 
                $("#filtered_majors a.chosen_major").on('click', function (e) {             
                    selected_major = $(this).attr('id');
                    $.getJSON("json/visuals/" + selected_major + ".json", function (data) {
                        // the nodes and links data(in the format required for the sankey visualisation) of the selected major is saved 
                        //from the json file into the "jsonData" variable
                        jsonData = data
                        $.each(data.nodes, function (i, data2) {
                            var chosen_subs_split = data2.name.split(" ");
                            // check if chosen_subs is contained in arr2(checkedValues)
                            //ie the array of values selected in the checkboxes is a superset of the first year variations in the JSON file
                            isSuperset = chosen_subs_split.every(function (val) {
                                return checkedValues.indexOf(val) >= 0;
                            });
                            if (isSuperset) {
                                // if the checked first year subjects are a superset of a given variation from the json file for the 
                                // selected major, get the target link values for the source node with the same value as the index of the given variation

                                //                        first_year_arr = arrayUnique(first_year_arr.concat(data2.name)).sort();
                                $.each(data.links, function (j, data2) {
                                    if (data2.source == i) {
                                        // all the source index values that satisfy the criterion for the first year subjects are saved in this variable
                                        target_sub_value_first = target_sub_value_first.concat(data2.source);
                                        // all the target index values that give the corresponding second year subjects which have the given first year
                                        // variation as pre-requisite are saved in this variable
                                        target_sub_value_second = target_sub_value_second.concat(data2.target);
                                    }
                                });
                                // based on the second year subjects saved in the array above the corresponding third year subjects which have the above
                                // second year and first year subjects as pre-requisites are stored in target_sub_value_third variable.
                                $.each(target_sub_value_second, function (i, value) {
                                    target_sub_second = data.nodes[value].name.split(" ")
                                    second_year_arr = arrayUnique(second_year_arr.concat(target_sub_second)).sort();
                                    $.each(data.links, function (j, data3) {
                                        if (data3.source == value) {
                                            target_sub_value_third = arrayUnique(target_sub_value_third.concat(data3.target));
                                            // the names of the third year subjects, based on the index values saved in the array above, 
                                            // are saved in "third_year_arr" variable.
                                            third_year_arr = third_year_arr.concat(data.nodes[data3.target].name).sort();
                                        }
                                    });
                                });
                                // all the duplicate values are removed from the arrays
                                target_sub_value_first = arrayUnique(target_sub_value_first)
                                third_year_arr = arrayUnique(third_year_arr)
                                filteredThirdSubs();
                            }
                        });
                    });
                });
            }
            var filteredThirdSubs = function () {
                $('#filtered_majors pre').empty();
                $('#filtered_majors ul').empty();
                $('#filtered_majors').hide();
                // create a list for the filtered third year subjects retrieved using the chosenMajor() function
                $.each(third_year_arr, function (i, value) {
                    $("#filtered_third_subs ul").append('<li><label><input type="checkbox" class="chosen_subjects" id="' + value + '"> ' + value + '</label></li>');
                });
                $("#filtered_third_subs").show();
                subsChecked();
            }
            var buildMajorData = function(){
                $("#view_visual").on('click', function (e) {
                    $("#filtered_third_subs ul").empty();
                    $("#filtered_third_subs").hide();
                    $('#show_chosen_subjects').empty();
                    $('#show_chosen_subjects').hide();
                    console.log(target_sub_value_first)
                    console.log(target_sub_value_second)
                    console.log(target_sub_value_third_final)
                    console.log(selected_major)
                    dataOb = $.getJSON("json/visuals/" + selected_major + ".json", function (data) {
                        return data
                    });
                    window.dataObject = JSON.parse(dataOb)
        //            window.getVis();
                    // Continue from here. The selected first year , second year and third year subjects have been saved in the variables logged above. They need to be removed from the data object nodes and the links need to be remodified so that they correspond to the correct source and target nodes. Once this is done the final object can be passed to the visualisation.js file. 
        //            window.chosen_major = $(this).attr('id')
        //            window.getVis();
                });
            }
            var buildMajorVis = function () {
                $("#chart").show();
                // when the user selects a major based on the chosen career
                $("#choose_careers a.select_major").on('click', function (e) {
                    $('#choose_careers').hide();
                    // get the id of the major
                    window.chosen_major = $(this).attr('id')
                    // the id is passed to visualisation.js file, major retrieved from the id is used to select the corresponding json file and  present the visualisation
                    window.getVis();
                });
                //
                $("#choose_majors a.select_major").on('click', function (e) {
                    $('#choose_majors').hide();
                    // get the id of the major
                    window.chosen_major = $(this).attr('id')
                    // the id is passed to visualisation.js file, major retrieved from the id is used to select the corresponding json file and  present the visualisation
                    window.getVis();
                });
            }
            $(".prev").on('click', function () {
                $('.steps').hide();
                $('#fetch').show();
                $("#chart").empty();
            });
        });