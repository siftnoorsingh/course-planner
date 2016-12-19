$(document).ready(function () {
    var appData = {};
    var checkedValues = {};
    var isSuperset = false;
    var major_arr = [];
    var second_year_arr = [];
    var third_year_arr = [];
    $("#careers").on('click', function (e) {
        $('#careers_list ul').empty();
        $('#careers_list pre').empty();
        e.preventDefault();
        $.getJSON('json/careers.json', function (data) {
            $.each(data.careers, function (i, data2) {
                $('#careers_list ul').append('<li><a href="#" class="select_career" id="' + data2.career + '"> ' + data2.career + '</a></li>');
            });
            bindSelectionHandler();
        });
        $('#fetch').hide();
        $('#careers_list').show();
    });
    $("#majors").on('click', function (e) {
        $('#majors_list ul').empty();
        $('#majors_list pre').empty();
        e.preventDefault();
        $.getJSON('json/majors.json', function (data) {
            $.each(data.majors, function (i, data2) {
                $('#majors_list ul').append('<li><a href="#" class="select_major2" id="' + data2.major + '"> ' + data2.major + '</a></li>');
            });
            bindSelectionHandler();
        });
        $('#fetch').hide();
        $('#majors_list').show();
    });
    $("#subjects").on('click', function (e) {
        $('#subjects_list ul').empty();
        $('#subjects_list pre').empty();
        e.preventDefault();
        $.getJSON('json/firstyrsubs.json', function (data) {
            $.each(data.first_year_subs, function (i, data2) {
                $.each(this, function (key, value) {
                    $('#subjects_list ul').append('<li><label><input type="checkbox" class="select_sub" id="' + key + '"> ' + key + '</label></li>');
                });
            });
            subsChecked();
        });
        $('#fetch').hide();
        $('#subjects_list').show();
    });
    var bindSelectionHandler = function () {
        $("#careers_list a.select_career").on('click', function (e) {
            $('#careers_list ul').empty();
            chosen_career = $(this).attr('id')
            e.preventDefault();
            $.getJSON('json/careers.json', function (data) {
                appData.careers = data.careers
                buildCareersList();
            });
        });
        $("#majors_list a.select_major2").on('click', function (e) {
            $('#majors_list ul').empty();
            chosen_major2 = $(this).attr('id')
            e.preventDefault();
            $.getJSON('json/majors.json', function (data) {
                appData.majors = data.majors
                buildSubsList();
            });
        });
    }
    var buildCareersList = function () {
        $.each(appData.careers, function (i, data2) {
            if (data2.career == chosen_career) {
                $('#choose_careers pre').html('<h2>Chosen Career: ' + data2.career + ' </h2>');
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
        $("#choose_majors li").on('click', 'input[type="checkbox"]', function (e) {
            $("#show_subjects ul").empty();
            checkedValues = $("#choose_majors li input[type=checkbox]:checked").map(function () {
                return $(this).attr('id');
                //                            return $(this).val();
            });
            $.each(checkedValues, function (i, d) {
                $("#show_subjects ul").append('<li>' + d + '</li>');
            });
            $("#show_subjects").show();
        });
        $("#subjects_list li").on('click', 'input[type="checkbox"]', function (e) {
            $("#show_majors ul").empty();
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
            $.getJSON('json/firstyrsubs.json', function (data) {
                $.each(data.subjects, function (i, data2) {
                    var chosen_subs = data2.first_subs
                        // check if chosen_subs is contained in arr2(checkedValues)
                        //ie the array of values selected in the checkboxes is a superset of the first year variations in the JSON file
                    isSuperset = chosen_subs.every(function (val) {
                        return checkedValues.indexOf(val) >= 0;
                    });
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
        $.each(major_arr, function (key, value) {
            $("#filtered_majors ul").append('<li><a href="#" class="chosen_major" id="' + value + '"> ' + value + '</a></li>');
        });
        $("#filtered_majors").show();
        chosenMajor();
    }
    var chosenMajor = function () {
        $("#filtered_majors a.chosen_major").on('click', function (e) {
            selected_major = $(this).attr('id');
            var target_sub_value_second = [];
            var target_sub_second = [];
            var target_sub_value_third = [];
            $.getJSON("json/visuals/" + selected_major + ".json", function (data) {
                $.each(data.nodes, function (i, data2) {
                    var chosen_subs_split = data2.name.split(" ");
                    // check if chosen_subs is contained in arr2(checkedValues)
                    //ie the array of values selected in the checkboxes is a superset of the first year variations in the JSON file
                    isSuperset = chosen_subs_split.every(function (val) {
                        return checkedValues.indexOf(val) >= 0;
                    });
                    if (isSuperset) {
                        $.each(data.links, function (j, data2) {
                            if (data2.source == i) {
                                target_sub_value_second = target_sub_value_second.concat(data2.target);
                            }
                        });
                        $.each(target_sub_value_second, function (i, value) {
                            target_sub_second = data.nodes[value].name.split(" ")
                            second_year_arr = arrayUnique(second_year_arr.concat(target_sub_second)).sort();
                            $.each(data.links, function (j, data3) {
                                if (data3.source == value) {
                                    target_sub_value_third = arrayUnique(target_sub_value_third.concat(data3.target));
                                    third_year_arr = third_year_arr.concat(data.nodes[data3.target].name).sort();
                                }
                            });
                        });
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
        $.each(third_year_arr, function (i, value) {
            $("#filtered_third_subs ul").append('<li><label><input type="checkbox" class="chosen_subjects" id="' + value + '"> ' + value + '</label></li>');
        });
        $("#filtered_third_subs").show();
    }
    var buildMajorVis = function () {
        $("#chart").show();
        $("#choose_careers a.select_major").on('click', function (e) {
            $('#choose_careers').hide();
            window.chosen_major = $(this).attr('id')
            window.getVis();
        });
        $("#choose_majors a.select_major").on('click', function (e) {
            $('#choose_majors').hide();
            window.chosen_major = $(this).attr('id')
            window.getVis();
        });
    }
    $(".prev").on('click', function () {
        $('.steps').hide();
        $('#fetch').show();
        $("#chart").empty();
    });
});