/**

2 @GIVE NAME
1     text note
1     note text
1     text overflow
1     connect text connector note
1     connect idea connect
1     link texts
1     text book
1     tagged
1     text-tags
1     texts and tags
1     text comfort
1     read station studio
1     zen reader taken by competitor
1     zen texts
1     text stream
1     text zone
1     Lesepult
1     one desk
1     top desk
1     slow reader
1     flow reader
1     faultier als logo
1     lazy spider
1     spider reader
1     Weberknecht
1     common mind
1     gedanken palast
1     connected sheets

@icons
text: BsBook
collection: BsCollection
notebook: BsClipboard
annotation: BsBookmark BsBookmarks (has many variations)
note: BsFileText
idea: BsLightening
question: BsQuestion
comment: BsChatSquareDots
keywords: BsHash BsTag
quote / reference: BsBlockquoteLeft, BsChatSqaureQuote
assumption:
argument: BsExclamation
method:
result:
other / ... : BsThreeDots
importance:
upload:
triangle arrow: BsCaret
collapse: BsArrowsCollapse
expand: BsArrowsExpand
desk: BsLaptop BsLayoutSidebar
library:
screen resize: BsArrowsAngleContract BsArrowsAngleExpand BsArrowsFullscreen BsFullscreen
expand collapse sidepanel: BsChevronCompactLeft / Right / Up /Down

start: BsPlay BsPlayFill
Pause: BsPause BsPauseFill
stop: BsStop
skip: BsSkipBackward...

add: BsPlus
edit: BsPencil BsPencilSquare
delete: BsTrash BsX
minimize: BsDash
open:
search: BsSearch
drag: BsArrowsMove

undo: BsArrow90degLeft BsArrowCounterclockwise
redo: BsArrowReturnRight  BsArrowClockwise

spinner: BsArrowClockwise BsArrowRepeat

fonts: BsFonts
h123: BsTypeH1
bold: BsTypeBold
italic: BsTypeItalic
underlined: BsTypeUnderline
strike through: BsTypeStrikethrough
bullet list: BsListOl Ul Task/Check
check list: BsCardChecklist
link: BsLink
parapgraph
left mid right align: BsJustify
color
imarge: BsImage

Logout: BsPower
login:
register:

@Business model
ads & donations
pay for extra cloud memory / offline mode / encryption of content / no ads / adding extras that companies want - link to outlook / office?
donate or share to keep using: set positive mind set for user. how to verify whether it is shared? Do you need to? Possible data issues with backtracing? maybe: if that link is used once, then it is verified. what about social components: see friends notebooks?
free forever for private users.

@WEB SCRAPING LIBRARIES -----------------------------
     ...

mind map libraries
*
react-flow
     MIT license
     looks good.
     provides react interface to pass attributes and handlers
     mini map component helps keep overview
     new: created_at 07-2019
     do I need react-flow when i use dagre anyway?
         handles zoom, draging, conecting
         whats the usecase? creating own mindmaps? manipulating resources in that view? show preview of elements.
     does not include an arrangment alogrythm and pass resolving algorithm

http://cs.brown.edu/people/jcmace/d3/graph.html?id=small.json

dagre
     MIT license
     layout library: arranges elements
       handles positioning
       how is it positing the items?

d3
     license BSD-3 clause
     js library for interactive data visualization

react-flow-chart
      MIT license
      looks okay - but more like a tool for creating instead of using mind maps
     created_at 11-2018

@RICH TEXT EDITORS (ranked by github stars)
...
   
   I need flexibility for own embeds: flexible @Names, embeded notes

   
   Notes need to be able to be splitted at embeded contents

   if an update is done, then 

text editor needs to know which section belongs to which note. can possibly be achieved by wrapping it into a div with classname Notebook and id

Do i need quill?
   Delta? Not necessarily when
   Custom blots: yes.


   undo redo functionality can be achieved from redux possibly


...
switch to slate in the future?
...
Quill
   free to use BSD
   allows
     weird highliting
    ? pasting in formatted text and pictures highliting

trix
   free to use MIT
   allows
     weird highliting
     pasting in formatted text and pictures highliting

tinyMCE
   free to use GNU


what about the Blockstyle editor?

SOFTWARE TO IMPLEMENT -------------------------------
express-sanitizer or express-mongo-sanitize
express-validator

GENERAL MERN SETUP -------------------------------------
express webframework: handles routing
express-validator validate body data (email, pw)
mongose adds abstraction layer to read / edit data / allows creation of models
bcrypt encrypts passwords
jsonwebtoken encrypts meta data of session: e.g. logged in status -> is used to access protectes routes
config for global variables
Moment: formats dates
postman
nodemon: (DevDep) watches server script updates
concurrently: (DevDep) run backend + frontend with one command
redux: state management library
react-redux: allow redux & react to work together
redux-thunk: middleware for redux. allows for async function inside actions (wait for response & dispatch)
redux-devtools-extension: allows for cleaner way to enable extension

ENVIRONMNENT SET UP BEFORE REACT (MERN)
npm init -y initializes package.json
npm i express bcryptjs jsonwebtoken config
npm i -D nodemon concurrently

ENVIRONMENT SET UP:
npx create-react-app .
npm i moment react-moment Formats Dates
npm i redux react-redux redux-thunk redux-devtools-extension
react-router-dom missing?
npm i materialize-css
npm install --save bootstrap

set up react redux with json server:
npx create-react-app .
npm i -D json-server concurrently
npm i redux react-redux redux-thunk redux-devtools-extension

 */
