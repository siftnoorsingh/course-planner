import pandas as pd
import numpy as np
import json
from collections import defaultdict

# add comments
def read_data(input_file):
    data = pd.read_excel(input_file,sheetname=1)
    # drops columns that contain only NA values in all of its rows 
    data.dropna(axis=1,how='all').head()
    # fill cells with NA values with empty space
    data.fillna(value=' ',inplace=True)
    return data

# takes an input file, output file and a major to generate a json file
# @input_file: takes an excel file as input
# @output_file: the name of the generated JSON file
# @major: the name of the major for which the output JSON file has been generated(eg. Immunology)
def generate_json(input_file,output_file,major):
    data = read_data(input_file) 
    # group the data based on the third year subjects
    grouped_data = data.groupby([col for col in data.columns if '3rd year' in col])
    # create a dictionary of nodes for the sankey diagram
    major_nodes = create_node_dict(data,grouped_data,major)
    # create a dictionary of links showing the relationship between nodes
    major_links = create_link_dict(data,grouped_data,major)
    # combine the link and node dictionaries together in the 
    #format required for generating a Sankey Diagram
    major_strs = create_visualisation_format(major_nodes,major_links)
    #json.dumps() method turns a Python data structure into JSON
    jsonData = json.dumps(major_strs)
    # Writing JSON data into output_file
    with open(output_file, 'w') as f:
        json.dump(major_strs, f)


# Generates a dictionary of nodes, with node names as key and sequentially generated ids as values
# @grouped_data: a list of lists containing the name of the major, and the different variations of
#                first, second and third year subjects to complete that major. The given example
#                shows one such variation
#                [u'Immunology'] - major
#                [u'BIOL10004' u'BIOL10005' ' ' ' '] - first yr subjects
#                [u'BCMB20002' u'MIIM20002' u'MIIM20001' ' ' ' ' ' '] - second year subjects
#                (u'BCMB30001', u'MIIM30002', u'MIIM30003', u'MIIM30015') - third year subjects as index
# @major: the name of the major for which the node dictionary needs to be generated
# output: {'BCMB20002 MIIM20001 MIIM20002': 2,
#  'BCMB30001': 3,
#  'BCMB30002': 7,
#  'BCMB30003': 8,
#  'BIOL10004 BIOL10005': 1,
#  'CEDB30002': 10,
#  'GENE30002': 11,
#  'Immunology': 0....
def create_node_dict(df,grouped_data,major):
    node_dict = dict()
    # counter for generating dictionary values as ids
    node_val = 10
    for name, group in grouped_data:
        if group['Major'].unique() == major:
            if group['Major'].unique()[0] not in node_dict.keys():
                node_dict[str(group['Major'].unique()[0])] = node_val
#                 node_val+=1
            # concatenate all subjects from a given year to create unique combinations to use as keys 
            # for the node dictionary
            # str.strip is used to remove all the list objects with empty space as values
            first_yr_subs = (' ').join(filter(str.strip,[str(x) for x in sorted(group[[col for col in df.columns if '1st' in col]].values[0])]))
            if first_yr_subs not in node_dict.keys():
                node_dict[first_yr_subs] = node_val
#                 node_val+=1
            # concatenate all subjects from a given year to create unique combinations as keys for the dictionary
            second_yr_subs = (' ').join(filter(str.strip,[str(x) for x in sorted(group[[col for col in df.columns if '2nd year' in col]].values[0])]))
            if second_yr_subs not in node_dict.keys():
                node_dict[second_yr_subs] = node_val
#                 node_val+=1
            # take each third year subject as seperate key for the dictionary instead of concatenated combinations
            # formed for first and second year subjects
            for name_obj in name:
                if str(name_obj) not in node_dict.keys():
                    node_dict[str(name_obj)] = node_val
#                     node_val+=1
    return node_dict

# Generates a dictionary of dictionary of links, with source nodes as keys for top-level dictionary,
# target nodes as keys for the internal dictionary and the number of times a specific source to target link
# occurs as the value for the internal dictionary
# @grouped_data: a list of lists containing the name of the major, and the different variations of
#                first, second and third year subjects to complete that major. The given example
#                shows one such variation
#                [u'Immunology'] - major
#                [u'BIOL10004' u'BIOL10005' ' ' ' '] - first yr subjects
#                [u'BCMB20002' u'MIIM20002' u'MIIM20001' ' ' ' ' ' '] - second year subjects
#                (u'BCMB30001', u'MIIM30002', u'MIIM30003', u'MIIM30015') - third year subjects as index
# @major: the name of the major for which the link dictionary needs to be generated
# output: defaultdict(dict,
#             {'BCMB20002 MIIM20001 MIIM20002': {u'BCMB30001': 2,
#               u'BCMB30002': 3,
#               u'BCMB30003': 4,
#               u'MIIM30002': 4,
#               u'MIIM30003': 4,
#               u'MIIM30015': 4},
#              'BIOL10004 BIOL10005': {'BCMB20002 MIIM20001 MIIM20002': 3,
#               'MIIM20001 MIIM20002': 5},
#              'Immunology': {'BIOL10004 BIOL10005': 8},
#              'MIIM20001 MIIM20002': {u'CEDB30002': 2,
#               u'GENE30002': 3,
#               u'MIIM30002': 6,
#               u'MIIM30003': 6,
#               u'MIIM30011': 4,
#               u'MIIM30014': 5,
#               u'MIIM30015': 6,
#               u'PATH30001': 6}})
def create_link_dict(df,grouped_data,major):
    link_dict = defaultdict(dict)
    link_val = 0
    for name, group in grouped_data:
        if group['Major'].unique() == major:
            first_yr_subs = (' ').join(filter(str.strip,[str(x) for x in sorted(group[[col for col in df.columns if '1st' in col]].values[0])]))
            second_yr_subs = (' ').join(filter(str.strip,[str(x) for x in sorted(group[[col for col in df.columns if '2nd year' in col]].values[0])]))
            # generate dict of dicts for all the links between the major and all the first year subject 
            # combinations, alongwith the number of times this link occurs
            link_dict[str(group['Major'].unique()[0])][first_yr_subs] = 40#link_dict[str(group['Major'].unique()[0])].get(first_yr_subs,0) + 1
            # generate dict of dicts for all the links between the first year subject combinations and second year 
            # subject combinations, alongwith the number of times this link occurs
            link_dict[first_yr_subs][second_yr_subs] = 20#link_dict[first_yr_subs].get(second_yr_subs,0) + 1
            for name_obj in name:
            # generate dict of dicts for all the links between the second year subject combinations and 
            # individual third year subjects, alongwith the number of times this link occurs                
                link_dict[second_yr_subs][name_obj] = 10#link_dict[first_yr_subs].get(second_yr_subs,0) + 1
    return link_dict

# Combines the node dictionary and link dictionary to generate a string containing all the information
# in the format required for the visualisation
# @node_dict: takes the dictionary of nodes, generated using create_node_dict, as argument
# @link_dict: takes the dictionary of links, generated using create_link_dict, as argument
# output: '{"nodes":[ {"name":"Immunology"},{"name":"BIOL10004 BIOL10005"},
# {"name":"BCMB20002 MIIM20001 MIIM20002"},{"name":"BCMB30001"},{"name":"MIIM30002"},{"name":"MIIM30003"},
# {"name":"MIIM30015"},{"name":"BCMB30002"},{"name":"BCMB30003"},{"name":"MIIM20001 MIIM20002"},
# {"name":"CEDB30002"},{"name":"GENE30002"},{"name":"MIIM30011"},{"name":"MIIM30014"},{"name":"PATH30001"},],
# "links":[ {"source":9,"target":6,"value":6},{"source":9,"target":13,"value":5},
#          {"source":9,"target":12,"value":4},{"source":9,"target":5,"value":6},
#          {"source":9,"target":14,"value":6},{"source":9,"target":10,"value":2},{"source":9,"target":4,"value":6},
#          {"source":9,"target":11,"value":3},{"source":1,"target":9,"value":5},{"source":1,"target":2,"value":3},
#          {"source":0,"target":1,"value":8},{"source":2,"target":6,"value":4},{"source":2,"target":7,"value":3},
#          {"source":2,"target":5,"value":4},{"source":2,"target":3,"value":2},{"source":2,"target":4,"value":4},
#          {"source":2,"target":8,"value":4},] }'
def create_visualisation_format(node_dict,link_dict):
    strs = """{"nodes":[ """
    for i in range(0,len(node_dict)):
        # append the dictionary keys to the string using dictionary values as input
        if i==0:
            strs += """{"name":"%s"}""" %(node_dict.keys()[node_dict.values().index(i)])
        else:
            strs += """,{"name":"%s"}""" %(node_dict.keys()[node_dict.values().index(i)])
    strs+="""],"""
    strs+=""""links":[ """
    j = True
    for key in link_dict:
        for inner_key in link_dict[key]:
            # replace the subject names in the link dictonary with the corresponding ids that were generated 
            # as values in the node dictionary
            if j:
                strs += """{"source":%s,"target":%s,"value":%s}""" % (str(node_dict[key]),str(node_dict[inner_key]),str(link_dict[key][inner_key]))
                j=False
            else:
                strs += """,{"source":%s,"target":%s,"value":%s"}""" % (str(node_dict[key]),str(node_dict[inner_key]),str(link_dict[key][inner_key]))   
    strs += """] }"""
    return strs

def generate_mult_json(input_file):
    data = read_data(input_file)
    for major in data['Major'].unique():
        if major != "Mathematics and Statistics":
            generate_json(input_file,"json/visuals/"+major+".json",major)
            
generate_mult_json("Combos.xlsx")

def career_major_dict(data):
    careers_col=[col for col in data.columns if 'Careers' in col]
    strs = """{"careers":["""
    first = True
    for major in data['Major'].unique():
        for career in np.unique(data[[col for col in careers_col]][data['Major']==major]):
            if career != " ":
                if first:
                    strs+="""{"career":"%s","major":"%s"}""" % (career,major)
                    first = False
                else:
                    strs+=""",{"career":"%s","major":"%s"}""" % (career,major)
    strs+="""]}"""
    return strs

# write comment
# @input_file: takes an excel file as input
# @output_file: the name of the generated JSON file
def generate_json_careers(input_file,output_file):
    data = read_data(input_file)
    # add comments
    career_list = career_major_dict(data)
    #json.dumps() method turns a Python data structure into JSON
    jsonData = json.dumps(career_list)
    # Writing JSON data into output_file
    with open(output_file, 'w') as f:
        json.dump(career_list, f)
        
generate_json_careers("Combos.xlsx","json/careers.json")

def major_subs_dict(data):
    firstyr_col=[col for col in data.columns if '1st y' in col]
    secondyr_col=[col for col in data.columns if '2nd year' in col]
    thirdyr_col=[col for col in data.columns if '3rd year' in col]
    strs = """{"majors":["""
    first = True
    second = True
    third = True
    fourth = True
    for major in data['Major'].unique():
        if fourth:
            strs+="""{"major":"%s","first":[""" % (major)
            fourth=False
        else:
            strs+=""",{"major":"%s","first":[""" % (major)
        for subs in np.unique(data[[col for col in firstyr_col]][data['Major']==major]):
            if subs != " ":
                if first:
                    strs+="""{"%s":"%s"}""" % (subs,subs)
                    first = False
                else:
                    strs+=""",{"%s":"%s"}""" % (subs,subs)
        strs+="""],"second":["""
        for subs in np.unique(data[[col for col in secondyr_col]][data['Major']==major]):
            if subs != " ":
                if second:
                    strs+="""{"%s":"%s"}""" % (subs,subs)
                    second = False
                else:
                    strs+=""",{"%s":"%s"}""" % (subs,subs)
        strs+="""],"third":["""
        for subs in np.unique(data[[col for col in thirdyr_col]][data['Major']==major]):
            if subs != " ":
                if third:
                    strs+="""{"%s":"%s"}""" % (subs,subs)
                    third = False
                else:
                    strs+=""",{"%s":"%s"}""" % (subs,subs)
        strs+="""]}"""
        first = True
        second = True
        third = True
    strs+="""]}"""
    return strs

# write comment
# @input_file: takes an excel file as input
# @output_file: the name of the generated JSON file
def generate_json_majors(input_file,output_file):
    data = read_data(input_file)
    # add comments
    subs_list = major_subs_dict(data)
    #json.dumps() method turns a Python data structure into JSON
    jsonData = json.dumps(subs_list)
    # Writing JSON data into output_file
    with open(output_file, 'w') as f:
        json.dump(subs_list, f)
        
generate_json_majors("Combos.xlsx","json/majors.json")

def firstyr_major_dict(data):
    firstyr_col=[col for col in data.columns if '1st y' in col]
    first_yr_grouped = data.groupby([col for col in firstyr_col])
    strs = """{"subjects":["""
    first = True
    second = True
    third= True
    for name, group in first_yr_grouped:
        if first:
            strs+="""{"first_subs":%s """ % ([str(x) for x in sorted(name) if x!=' '])
            first = False
        else:
            strs+=""",{"first_subs":%s """ % ([str(x) for x in sorted(name) if x!=' '])
        strs+= ""","major":["""
        for major in group['Major'].unique():
            if second:
                strs+=""" "%s" """ % (major)
                second = False
            else:
                strs+=""","%s" """ % (major)
        strs+="""]}"""
        second = True   
    strs+= """],"first_year_subs":["""
    for sub in np.unique(data[[col for col in firstyr_col]]):
        if sub!=" ":
            if third:
                strs+="""{"%s":"%s"}""" % (sub,sub)
                third = False
            else:
                strs+=""",{"%s":"%s"}""" % (sub,sub)            
            
    strs+="""]}"""
    first = True
    return strs.replace("'",'"')

# write comment
# @input_file: takes an excel file as input
# @output_file: the name of the generated JSON file
def generate_json_subs(input_file,output_file):
    data = read_data(input_file)
    # add comments
    firstyr_list = firstyr_major_dict(data)
    #json.dumps() method turns a Python data structure into JSON
    jsonData = json.dumps(firstyr_list)
    # Writing JSON data into output_file
    with open(output_file, 'w') as f:
        json.dump(firstyr_list, f)
        
generate_json_subs("Combos.xlsx","json/firstyrsubs.json")