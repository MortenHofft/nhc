/*
Start with a list of institution codes ordered by usage

A tool that allows you to go through them

For each code it will pull together info:

how many times it is used
Which institution IDs it is used with
Which dataset use it
which publisher use it
occurrences examples for each if expanded
if the code exists in wikidata, grid, ror
if it exists in grscicoll
if it is in index herbariorum?

And allow you to create or edit a grscicoll institution entry

Data is saving as a json blob of edited grscicoll entities
uuid: 
  code
  alternatives codes {qualifier, code}
  title
  description
  location (lat, lng)
  address + physical address


Tasks that the tool does
  1: Update GrBio with codes so that specimens can be matched. Create new if required.
  2: Create issues for publishers if the code is ambiguous or missing
  3: Update the content of GrBio to be of better quality (name, description, address, ...

To support 1) 
From a code
  try to find a grbio match based on code
    If there are 1 match
      Check that it seems a likely match for these datasets and publishers
    If there are multiple grbio matches, then check that it is always used with an well formed ID. Else create issue

  instId, dataset title, publisher title, and allow free text search for institutions and
  Check if wikipedia/wikidata/grid/ror has content (find suggestions based in code, id, grbio title if available)


So for each code
We update one or more institutions, 
We attach data issues to a code (or show related issues for each code based on its content)
    an issue is: this dataset is using this code or id (n times) and we cannot disambiguate/match it.

are there multiple views
list and details
list is showing code, ids (and resolved names if possible?), publisher titles, dataset titles and grbio matches. If there are no or multiple matches, then no shortcuts.
  else click 'correct match' and continue.

For each updated grbio entry we have 1 flag: 'content updated'.
For each code we have a flag: 'records cannot be matched'

and we have a list of created data issues (that can be solved be default values or contacting the publisher)




For this code we have these
datasets, publishers, institutions, sample occurrences, is the code ever used without an identifier

You need to decide what to do
Is the match good?
Should the published data change?
Should grbio be updated with a new code or identifier.
Should a new entry be added to grbio?

While you are at it, do you wish to update the grbio entry with a better title, description and location?



*/
