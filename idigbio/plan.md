Idigbio should map to both institutions ancd collections. 
Like IH there should be one of each.


* decorate idigbio with 
irn
biocol id
grbio id
code without <IH>
normalized name

* decorate institutions and collections with
normalized name
biocol id
grbio id
irn

* Match to institution by
grbio ids (collection_lsid)
biocol ids (collection_lsid)
code
irn
title (fuzzy title etc)

Matches can be off several kinds
idigbio inst to grbio inst
idigbio inst to grbio coll
idigbio coll to grbio inst
idigbio coll to grbio coll

# procedure for matching
if the idig inst or coll code is matching an institution (and e.g. title), then a match should be made - with a flag indicating the conflict?

when syncing, then we should update grbio to use idigbio inst code and create/update a grbio coll using the collection code.

# match approach
match to institutions first - there should always be an institution either way.
also use coll code to match to grbio inst.

Start with IH matching (and title?)
Then other identifiers (and title?)
Then by inst code and title
then by inst code and fuzzy title
Then by coll code and title
then by coll code and fuzzy title



I suggest not to update the institution titles in grbio in cases where they are very different?, but create collections for each using a combination of their institution and collection names

E.g. Rocky Mountain Forest and Range Experiment Station (e595dfab-3f20-48be-adda-68d0a469b38a) is reused by following iDigBio entries
* US Forest Service Southwestern Region (USFS)
* Gila National Forest (USFS)
* Southwestern Regional Forest Service (USFS)
* Coconino National Forest (USFS)
if the iDigBio info is correct they all claim to be the sameAs the IH "Rocky Mountain Forest ..." entry.

We would then keep the grbio IH institution and create collections for each of the 4 iDigBio entries.


# overall approach
idigbio entries will create/update an institution and a collection. Not worrying about how to map, then how to approach?
First step seem to be to map all entries to grbio institutions.
Some will be map to the same. That is okay. Use the names from iDigBio (unless there are conflicting names in iDigBio, then create an issue and keep the existing grbio name). Updates comes with IH restrictions.

Next step: create collections.
For each mapped institution create the mapped idigbio collections. Use the institution name + the collection name as a name for the collection.
But first, we test if the institution already have a collection with that code or irn/identifier. If so we update that (with IH restrictions).


# How to match institutions? 
Always require the country to be correct (if present).

if irn and no code conflict, then link.
if identifier and no code conflict, then link.
if code and title, then link
if code and city and no country conflict then link
if title and city and no code conflict and no country conflict then link

what to do when
* multiple that match by both code and title - choose any?
* multiple that match by title (and idigbio do not have a code) - choose any
* multiple matches by name, but no code match - create a new

idigbio entries in total: 1591

Matching IRNs are considered a perfect match
idigbio entries with an IRN in total: 563
  561 could be matched to an institution
    of those 347 have a good title match
    random sampling of a few of the remaining irn-matches show that the names are too different, but seems to be the correct entity
    ex: iDigBio "University of the Sciences in Philadelphia" vs IH "University of the Sciences"
  