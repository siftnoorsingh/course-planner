# course-planner

Course Planner is a web app that allows the students to plan their curriculum based on the careers, majors and subjects they are interested in.

There are three pathways to choose from:
* Get Careers
    The users start by choosing a career from a list of potential careers. Based on the chosen career, the users are presented with a list of majors they can pursue, for getting into the selected career. Once a major is chosen by the users, they are presented with a list of third year subjects that they can choose from. The chosen third year subjects will present a Sankey Diagram containing the various paths the users can follow, ie the various first, second and third year subjects that they can choose, for getting a job in their desired career.
    
* Get Majors
    The users start by choosing a major from a list of potential majors. Based on the chosen major, the users are presented with a list of available third year subjects they need to complete for that major. Once the users select the required third year subjects, they are presented with a Sankey diagram similar to the one in the "Get Careers" pathway, but based on the subjects and major chosen by the users.
    
* Get Subjects (First Year)
    The users start by choosing subjects from a list of first year subjects. Based on the chosen first year subjects, the users are presented with a list of majors that they can pursue. When the users select a major from the list of presented majors, they are provided with a list of third year subjects that they can choose from. Once the users have a selected a set of third year subjects, they are presented with a Sankey Diagram showing the various pathways that the user can pursue based on the selected parameters.
    

## Future Work (in order of priority from top to bottom)

* HTML Formatting
* Optimise the code by removing duplicate functions performing the same task from main.js
* Add the option to go to previous window (that the user came from) by clicking on a button
* Generate_json.ipynb needs to be fixed so that the JSON files do not have unnecessary "/" symbols as well as double apostrophe commas at the beginning and end of the generated JSON files
* Build a secure UI for uploading new csv files such that whenever a new csv file is uploaded, the "Generate_json.ipynb" script is automatically run and the old json files are updated with the new data.
* Add option to choose third year subjects after choosing a major in the "Get Careers" pathway
* Present visualisation based on the chosen major and chosen third year subjects in the "Get Majors" pathway
* Present visualisation based on the chosen third year subjects in the "Get Subjects (First Year)" pathway
* Add AJAX autocomplete feature wherever there is a long list of options of to choose from
* Add an option to choose a maximum of five first year subjects
* Add an option to choose a maximum of ten third year subjects
* Subjects should be added to a table and present dynamically in the UI as they are chosen
* The visualisation should be dynamically updated and presented whenever a user selects a major or a set of subjects
* Present the number of variations left whenever a choice of majors or subjects is made
* Option to select multiple majors rather than just one.